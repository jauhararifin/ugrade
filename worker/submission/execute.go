package submission

import (
	"context"
	"io/ioutil"
	"path"
	"time"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/testcase"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (ex *defaultExecutor) Execute(
	ctx context.Context,
	spec worker.JobSpec,
	tcSuite testcase.Suite,
) (*ExecutionResult, error) {
	// compile contestant solution
	logrus.
		WithField("source", spec.Submission).
		WithField("outputLimit", spec.OutputLimit).
		WithField("timeLimit", spec.TimeLimit).
		WithField("memoryLimit", spec.MemoryLimit).
		Debug("compile contestant solution")
	compiledSubmission, err := ex.compiler.Compile(ctx, spec.Submission)
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile contestant solution")
	}
	logrus.WithField("result", compiledSubmission).Debug("contestant solution compiled")

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
		return nil, errors.Wrap(err, "cannot create temporary directory for contestant output")
	}
	logrus.WithField("dir", outputDir).Debug("temporary directory for contestant output created")

	// run submission using every testcase in testcase suite.
	execItems := make([]ExecutionItem, 0, 0)
	cpulimit := time.Duration(uint64(cpuULimit)) * time.Nanosecond
	memlimit := uint64(memULimit)
	logrus.WithField("cpulimit", cpulimit).WithField("memlimit", memlimit).Debug("running contestant solution")
	for _, tcitem := range tcSuite.Items {
		logrus.WithField("input", tcitem.Input).WithField("tcitem", tcitem.Output).Trace("run contestant solution")

		cmd := sandbox.Command{
			TimeLimit:      cpulimit,
			MemoryLimit:    memlimit,
			MemoryThrottle: memlimit + 8*1024*1024, // give 8MB to throttle memory?
			FileSize:       spec.OutputLimit,
			OpenFile:       64,
			NProc:          64,
			ImagePath:      compiledSubmission.RuntimeImage,
			Path:           path.Join("/program", compiledSubmission.ExecName),
			Stdin:          path.Join("/testcases", tcitem.Input),
			Stdout:         path.Join("/outputs", tcitem.Output),
			Args:           []string{},
			Binds: []sandbox.FSBind{
				sandbox.FSBind{
					Host:    tcSuite.Dir,
					Sandbox: "/testcases",
				},
				sandbox.FSBind{
					Host:    compiledSubmission.ExecDir,
					Sandbox: "/program",
				},
				sandbox.FSBind{
					Host:    outputDir,
					Sandbox: "/outputs",
				},
			},
		}
		usage, err := ex.executor.Execute(ctx, cmd)
		logrus.WithField("err", err).WithField("usage", usage).Trace("contestant solution executed")

		execItem := ExecutionItem{
			InputName:  tcitem.Input,
			OutputName: tcitem.Output,
			Usage:      usage,
			Err:        err,
		}
		execItems = append(execItems, execItem)
	}

	return &ExecutionResult{
		Dir:   outputDir,
		Items: execItems,
	}, nil
}
