package checker

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"strings"
	"time"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/submission"
	"github.com/jauhararifin/ugrade/worker/testcase"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

var verdictLevel map[string]int

func init() {
	verdictLevel = make(map[string]int)
	verdictLevel[worker.CE] = 1
	verdictLevel[worker.IE] = 2
	verdictLevel[worker.RTE] = 3
	verdictLevel[worker.MLE] = 4
	verdictLevel[worker.TLE] = 5
	verdictLevel[worker.WA] = 6
	verdictLevel[worker.PENDING] = 7
	verdictLevel[worker.AC] = 8
}

func (ck *defaultChecker) CheckSuite(
	ctx context.Context,
	spec worker.JobSpec,
	tcSuite testcase.Suite,
	submissionExec submission.ExecutionResult,
) (*CheckSuite, error) {
	// compile checker
	logrus.
		WithField("source", spec.Checker).
		WithField("outputLimit", spec.OutputLimit).
		WithField("timeLimit", spec.TimeLimit).
		WithField("memoryLimit", spec.MemoryLimit).
		Debug("compile checker")
	compiledChecker, err := ck.compiler.Compile(ctx, spec.Checker)
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile checker")
	}
	logrus.WithField("result", compiledChecker).Debug("checker compiled")

	// check validity of `tcSuite.Items` and `submissionExec.Items`
	logrus.Debug("validate items inside submission and testcase")
	if len(tcSuite.Items) != len(submissionExec.Items) {
		return nil, errors.New("the number of contestant output differ from the number of jury output")
	}
	for i := 0; i < len(tcSuite.Items); i++ {
		if tcSuite.Items[i].Input != submissionExec.Items[i].InputName {
			return nil, errors.Errorf(
				"jury input name (%s) differ from contestant input name (%s)",
				tcSuite.Items[i].Input,
				submissionExec.Items[i].InputName,
			)
		}
	}

	// create temporary directory for storing verdict
	outputDir, err := ioutil.TempDir("", "ugrade-checker-verdict-")
	if err != nil {
		return nil, errors.Wrap(err, "cannot create temporary directory for checker outputs")
	}
	logrus.WithField("dir", outputDir).Debug("use directory for storing verdicts")

	logrus.Debug("checking submission and testcase using checker")
	items := make([]CheckItem, 0, 0)
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

		verdict := worker.PENDING
		var err error
		if submissionExec.Items[i].Err != nil {
			logrus.
				WithField("i", i).
				WithField("error", submissionExec.Items[i].Err).
				Trace("submission contain error")

			cause := errors.Cause(submissionExec.Items[i].Err)
			if _, ok := cause.(sandbox.TimeLimitExceeded); ok {
				verdict = worker.TLE
			} else if _, ok := cause.(sandbox.RuntimeError); ok {
				verdict = worker.RTE
			} else if _, ok := cause.(sandbox.MemoryLimitExceeded); ok {
				verdict = worker.MLE
			} else if _, ok := cause.(worker.CompilationError); ok {
				verdict = worker.CE
			} else {
				verdict = worker.IE
			}
		} else {
			logrus.
				WithField("i", i).
				WithField("checkerDir", compiledChecker.ExecDir).
				WithField("tcSuiteDir", tcSuite.Dir).
				WithField("submissionDir", submissionExec.Dir).
				WithField("verdictsDir", outputDir).
				Trace("run checker")

			cmd := sandbox.Command{
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
				Binds: []sandbox.FSBind{
					sandbox.FSBind{
						Host:    compiledChecker.ExecDir,
						Sandbox: "/program",
					},
					sandbox.FSBind{
						Host:    tcSuite.Dir,
						Sandbox: "/testcases",
					},
					sandbox.FSBind{
						Host:    submissionExec.Dir,
						Sandbox: "/outputs",
					},
					sandbox.FSBind{
						Host:    outputDir,
						Sandbox: "/verdicts",
					},
				},
			}

			_, err = ck.executor.Execute(ctx, cmd)
			if err != nil {
				err = errors.Wrap(err, "cannot run checker")
				verdict = worker.IE
			} else {
				var verdictFile *os.File
				verdictFile, err = os.Open(path.Join(outputDir, output))
				if err != nil {
					err = errors.Wrap(err, "cannot open verdict file")
				}
				defer verdictFile.Close()
				_, err = fmt.Fscan(verdictFile, &verdict)
				if err != nil {
					verdict = worker.IE
				} else {
					if strings.ToLower(verdict) == "ac" {
						verdict = worker.AC
					} else if strings.ToLower(verdict) == "wa" {
						verdict = worker.WA
					} else {
						err = errors.New("unrecognize verdict " + verdict)
						verdict = worker.IE
					}
				}
			}
		}
		logrus.
			WithField("i", i).
			WithField("verdict", verdict).
			WithField("error", err).
			Trace("submission checked")

		items = append(items, CheckItem{
			InputPath:     input,
			OutputPath:    output,
			ExcpectedPath: expected,
			Verdict:       verdict,
			Err:           err,
		})
	}

	// calculate result verdict
	currentVerdict := worker.AC
	for _, item := range items {
		if verdictLevel[currentVerdict] > verdictLevel[item.Verdict] {
			currentVerdict = item.Verdict
		}
	}

	return &CheckSuite{
		Items:   items,
		Verdict: currentVerdict,
	}, nil
}
