package worker

import (
	"context"
	"io/ioutil"
	"strings"
	"time"

	"github.com/jauhararifin/ugrade/grader/sandbox"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
)

// MaxExtractTime indicates maximum time consumed for extracting job spec.
const MaxExtractTime = 10 * time.Second

// MaxCompileTime indicates maximum time consumed for compiling program.
const MaxCompileTime = 10 * time.Second

// MaxGenerateInputTC indicates maximum time consumed for generating input files
const MaxGenerateInputTC = 30 * time.Second

// MaxGenerateOutputTC indicates maximum time consumed for generating output testcases
const MaxGenerateOutputTC = 5 * time.Minute

// MaxGenerateContestantOutput indicates maximum time running contestant program
const MaxGenerateContestantOutput = 5 * time.Minute

func (worker *defaultWorker) Execute(ctx context.Context, job grader.Job) (*grader.JobResult, error) {
	// prepare working directory
	workDir, err := worker.prepareWorkDir()
	if err != nil {
		return nil, errors.Wrap(err, "cannot create working directory inside sandbox")
	}
	// defer workDir.remove() // remove directory after job finished

	// extracting spec tar file
	extactCtx, cancelExtractCtx := context.WithTimeout(ctx, MaxExtractTime)
	defer cancelExtractCtx()
	specs, err := worker.extractSpec(extactCtx, *workDir, job.Spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot extract spec file")
	}
	ioutil.ReadAll(job.Spec)
	job.Spec.Close()

	// compile testcase generator
	tcgenCompCtx, canceltcgenCompCtx := context.WithTimeout(ctx, MaxCompileTime)
	defer canceltcgenCompCtx()
	tcgenExec, err := worker.compileTCGen(tcgenCompCtx, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error compiling testcase generator")
	}

	// generate testcase input
	genTCInCtx, cancelGenTCInCtx := context.WithTimeout(ctx, MaxGenerateInputTC)
	defer cancelGenTCInCtx()
	tcin, err := worker.generateTCInputs(genTCInCtx, *tcgenExec, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error generating testcase inputs")
	}

	// compile jury solution
	juryCompCtx, cancelJuryCompCtx := context.WithTimeout(ctx, MaxCompileTime)
	defer cancelJuryCompCtx()
	compiledJury, err := worker.compileJurySolution(juryCompCtx, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error compiling jury solution")
	}

	// generate testcase suite
	juryOutCtx, cancelJuryOutCtx := context.WithTimeout(ctx, MaxGenerateOutputTC)
	defer cancelJuryOutCtx()
	juryOutputs, err := worker.generateTCOutputs(juryOutCtx, *tcin, *compiledJury, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error generating testcase outputs")
	}

	// compile contestant solution. gives compile error when failing to compile.
	contestantCompCtx, cancelContestantComp := context.WithTimeout(ctx, MaxCompileTime)
	defer cancelContestantComp()
	compiledContestant, err := worker.compileContestantSolution(contestantCompCtx, *specs)
	if err != nil {
		return &grader.JobResult{
			Job:     job,
			Verdict: grader.CE,
			Output:  ioutil.NopCloser(strings.NewReader(err.Error())),
		}, nil
	}

	// run contestant solution
	contestantRunCtx, cancelContestantRun := context.WithTimeout(ctx, MaxGenerateContestantOutput)
	defer cancelContestantRun()
	contestantOutputs, err := worker.generateContestantOutputs(contestantRunCtx, *tcin, *compiledContestant, *specs)
	if err != nil {
		if errors.Cause(err) == sandbox.ErrTimeLimitExceeded {
			return &grader.JobResult{
				Job:     job,
				Verdict: grader.TLE,
				Output:  ioutil.NopCloser(strings.NewReader("")),
			}, nil
		} else if errors.Cause(err) == sandbox.ErrMemoryLimitExceeded {
			return &grader.JobResult{
				Job:     job,
				Verdict: grader.MLE,
				Output:  ioutil.NopCloser(strings.NewReader("")),
			}, nil
		} else if errors.Cause(err) == sandbox.ErrRuntimeError {
			return &grader.JobResult{
				Job:     job,
				Verdict: grader.RTE,
				Output:  ioutil.NopCloser(strings.NewReader(err.Error())),
			}, nil
		}
		return nil, errors.Wrap(err, "error executing contestant solution")
	}

	// compile checker
	checkerCompCtx, cancelCheckerComp := context.WithTimeout(ctx, MaxCompileTime)
	defer cancelCheckerComp()
	compiledChecker, err := worker.compileChecker(checkerCompCtx, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error compiling checker")
	}

	grading, err := worker.generateGrading(ctx, *compiledChecker, *contestantOutputs, *juryOutputs)
	if err != nil {
		return nil, errors.Wrap(err, "error run checker")
	}

	return &grader.JobResult{
		Job:     job,
		Verdict: grading.verdict,
		Output:  ioutil.NopCloser(strings.NewReader("i just randomize the verdict and unfortunately you got WA")),
	}, nil
}
