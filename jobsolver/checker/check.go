package checker

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

var verdictLevel map[ugrade.Verdict]int

func init() {
	verdictLevel = make(map[ugrade.Verdict]int)
	verdictLevel[ugrade.VerdictCE] = 1
	verdictLevel[ugrade.VerdictIE] = 2
	verdictLevel[ugrade.VerdictRTE] = 3
	verdictLevel[ugrade.VerdictMLE] = 4
	verdictLevel[ugrade.VerdictTLE] = 5
	verdictLevel[ugrade.VerdictWA] = 6
	verdictLevel[ugrade.VerdictPENDING] = 7
	verdictLevel[ugrade.VerdictAC] = 8
}

func (ck *defaultChecker) CheckSuite(
	ctx context.Context,
	spec ugrade.JobSpec,
	tcSuite jobsolver.TCSuite,
	submissionExec jobsolver.ExecutionResult,
) (*jobsolver.CheckSuite, error) {
	// compile checker
	logrus.
		WithField("source", spec.Checker).
		WithField("outputLimit", spec.OutputLimit).
		WithField("timeLimit", spec.TimeLimit).
		WithField("memoryLimit", spec.MemoryLimit).
		Debug("compile checker")
	compiledChecker, err := ck.compiler.Compile(ctx, spec.Checker)
	if err != nil {
		return nil, xerrors.Errorf("cannot compile checker: %w", err)
	}
	logrus.WithField("result", compiledChecker).Debug("checker compiled")

	// remove compiled checker after finish
	// TODO: check for error
	defer os.RemoveAll(compiledChecker.ExecDir)

	// check validity of `tcSuite.Items` and `submissionExec.Items`
	logrus.Debug("validate items inside submission and testcase")
	if len(tcSuite.Items) != len(submissionExec.Items) {
		return nil, xerrors.New("the number of contestant output differ from the number of jury output")
	}
	for i := 0; i < len(tcSuite.Items); i++ {
		if tcSuite.Items[i].Input != submissionExec.Items[i].InputName {
			return nil, xerrors.Errorf(
				"jury input name (%s) differ from contestant input name (%s)",
				tcSuite.Items[i].Input,
				submissionExec.Items[i].InputName,
			)
		}
	}

	// create temporary directory for storing verdict
	outputDir, err := ioutil.TempDir("", "ugrade-checker-verdict-")
	if err != nil {
		return nil, xerrors.Errorf("cannot create temporary directory for checker outputs: %w", err)
	}
	logrus.WithField("dir", outputDir).Debug("use directory for storing verdicts")

	// remove output directory when done
	// TODO: check for error
	defer os.RemoveAll(outputDir)

	logrus.Debug("checking submission and testcase using checker")
	items := make([]jobsolver.CheckItem, 0, 0)
	for i := 0; i < len(tcSuite.Items); i++ {
		input := tcSuite.Items[i].Input
		expected := tcSuite.Items[i].Output
		output := submissionExec.Items[i].OutputName
		logrus.
			WithField("input", input).
			WithField("expected", expected).
			WithField("output", output).
			WithField("i", i).
			Trace("checking submission execution")

		verdict := ugrade.VerdictPENDING
		var err error
		if submissionExec.Items[i].Err != nil {
			logrus.
				WithField("i", i).
				WithField("error", submissionExec.Items[i].Err).
				Trace("submission contain error")

			if xerrors.Is(submissionExec.Items[i].Err, ugrade.ErrTimeLimitExceeded) {
				verdict = ugrade.VerdictTLE
			} else if xerrors.Is(submissionExec.Items[i].Err, ugrade.ErrRuntimeError) {
				verdict = ugrade.VerdictRTE
			} else if xerrors.Is(submissionExec.Items[i].Err, ugrade.ErrMemoryLimitExceeded) {
				verdict = ugrade.VerdictMLE
			} else if xerrors.Is(submissionExec.Items[i].Err, ugrade.ErrCompilationError) {
				verdict = ugrade.VerdictCE
			} else {
				verdict = ugrade.VerdictIE
			}
		} else {
			logrus.
				WithField("i", i).
				WithField("checkerDir", compiledChecker.ExecDir).
				WithField("tcSuiteDir", tcSuite.Dir).
				WithField("submissionDir", submissionExec.Dir).
				WithField("verdictsDir", outputDir).
				Trace("run checker")

			cmd := ugrade.Command{
				TimeLimit:     spec.TimeLimit,
				WallTimeLimit: spec.TimeLimit + 2*time.Second,
				MemoryLimit:   spec.MemoryLimit,

				// add 8MB for throttling?
				MemoryThrottle: spec.MemoryLimit + 8*1024*1024,

				// the output of checker should only one of `AC` or `WA`
				FileSize:  1024,
				OpenFile:  64,
				NProc:     64,
				ImagePath: compiledChecker.RuntimeImage,
				Path:      path.Join("/program", compiledChecker.ExecName),
				Args: []string{
					path.Join("/outputs", output),
					path.Join("/testcases", expected),
					path.Join("/testcases", input),
				},
				Stdout: path.Join("/verdicts", output),
				Binds: []ugrade.FSBind{
					ugrade.FSBind{
						Host:    compiledChecker.ExecDir,
						Sandbox: "/program",
					},
					ugrade.FSBind{
						Host:    tcSuite.Dir,
						Sandbox: "/testcases",
					},
					ugrade.FSBind{
						Host:    submissionExec.Dir,
						Sandbox: "/outputs",
					},
					ugrade.FSBind{
						Host:    outputDir,
						Sandbox: "/verdicts",
					},
				},
			}

			_, err = ck.sandbox.Execute(ctx, cmd)
			if err != nil {
				err = xerrors.Errorf("cannot run checker: %w", err)
				verdict = ugrade.VerdictIE
			} else {
				var verdictFile *os.File
				verdictFile, err = os.Open(path.Join(outputDir, output))
				if err != nil {
					err = xerrors.Errorf("cannot open verdict file: %w", err)
				}
				defer verdictFile.Close()
				_, err = fmt.Fscan(verdictFile, &verdict)
				if err != nil {
					verdict = ugrade.VerdictIE
				}
			}
		}
		logrus.
			WithField("i", i).
			WithField("verdict", verdict).
			WithField("error", err).
			Trace("submission checked")

		items = append(items, jobsolver.CheckItem{
			InputPath:     input,
			OutputPath:    output,
			ExcpectedPath: expected,
			Verdict:       verdict,
			Err:           err,
		})
	}

	// calculate result verdict
	currentVerdict := ugrade.VerdictAC
	for _, item := range items {
		if verdictLevel[currentVerdict] > verdictLevel[item.Verdict] {
			currentVerdict = item.Verdict
		}
	}

	return &jobsolver.CheckSuite{
		Items:   items,
		Verdict: currentVerdict,
	}, nil
}
