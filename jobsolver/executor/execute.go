package executor

import (
	"context"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

func (ex *defaultExecutor) Execute(
	ctx context.Context,
	spec ugrade.JobSpec,
	tcSuite jobsolver.TCSuite,
) (*jobsolver.ExecutionResult, error) {
	// compile contestant solution
	logrus.
		WithField("source", spec.Submission).
		WithField("outputLimit", spec.OutputLimit).
		WithField("timeLimit", spec.TimeLimit).
		WithField("memoryLimit", spec.MemoryLimit).
		Debug("compile contestant solution")
	compiledSubmission, err := ex.compiler.Compile(ctx, spec.Submission)
	if err != nil {
		return nil, xerrors.Errorf("cannot compile contestant solution: %w", err)
	}
	logrus.WithField("result", compiledSubmission).Debug("contestant solution compiled")

	// remove compiled contestant solution after finish
	// TODO: check for error
	defer os.RemoveAll(compiledSubmission.ExecDir)

	// determine memory limit and cpu limit
	cpuULimit := float64(tcSuite.MaxCPU.Nanoseconds()) * (1.0 + spec.Tolerance)
	memULimit := float64(tcSuite.MaxMemory) * (1.0 + spec.Tolerance)
	if float64(spec.MemoryLimit) > memULimit {
		memULimit = float64(spec.MemoryLimit)
	}
	logrus.WithField("memory", memULimit).WithField("cpu", cpuULimit).Debug("use memory and cpu limit")

	// create temporary directory for contestant outputs
	logrus.Debug("creating temporary directory for contestant output")
	outputDir, err := ioutil.TempDir("", "ugrade-contestant-output-")
	if err != nil {
		return nil, xerrors.Errorf("cannot create temporary directory for contestant output: %w", err)
	}
	logrus.WithField("dir", outputDir).Debug("temporary directory for contestant output created")

	// run submission using every testcase in testcase suite.
	execItems := make([]jobsolver.ExecutionItem, 0, 0)
	cpulimit := time.Duration(uint64(cpuULimit)) * time.Nanosecond
	walllimit := spec.TimeLimit
	if cpulimit > walllimit {
		walllimit = cpulimit
	}
	memlimit := uint64(memULimit)
	logrus.
		WithField("cpulimit", cpulimit).
		WithField("memlimit", memlimit).
		WithField("walllimit", walllimit).
		Debug("running contestant solution")
	for _, tcitem := range tcSuite.Items {
		logrus.WithField("input", tcitem.Input).WithField("tcitem", tcitem.Output).Trace("run contestant solution")

		cmd := ugrade.Command{
			TimeLimit:      cpulimit,
			WallTimeLimit:  walllimit,
			MemoryLimit:    memlimit,
			MemoryThrottle: memlimit + 8*1024*1024, // give 8MB to throttle memory?
			FileSize:       spec.OutputLimit,
			OpenFile:       64, // TODO: limit this
			NProc:          64, // TODO: limit this
			ImagePath:      compiledSubmission.RuntimeImage,
			Path:           path.Join("/program", compiledSubmission.ExecName),
			Stdin:          path.Join("/testcases", tcitem.Input),
			Stdout:         path.Join("/outputs", tcitem.Output),
			Args:           []string{},
			Binds: []ugrade.FSBind{
				ugrade.FSBind{
					Host:    tcSuite.Dir,
					Sandbox: "/testcases",
				},
				ugrade.FSBind{
					Host:    compiledSubmission.ExecDir,
					Sandbox: "/program",
				},
				ugrade.FSBind{
					Host:    outputDir,
					Sandbox: "/outputs",
				},
			},
		}
		usage, err := ex.sandbox.Execute(ctx, cmd)
		logrus.WithField("err", err).WithField("usage", usage).Trace("contestant solution executed")

		execItem := jobsolver.ExecutionItem{
			InputName:  tcitem.Input,
			OutputName: tcitem.Output,
			Usage:      usage,
			Err:        err,
		}
		execItems = append(execItems, execItem)
	}

	return &jobsolver.ExecutionResult{
		Dir:   outputDir,
		Items: execItems,
	}, nil
}
