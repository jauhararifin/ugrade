package worker

import (
	"context"
	"io/ioutil"
	"strings"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
)

func (worker *defaultWorker) Execute(ctx context.Context, job grader.Job) (*grader.JobResult, error) {
	// prepare working directory
	workDir, err := worker.prepareWorkDir()
	if err != nil {
		return nil, errors.Wrap(err, "cannot create working directory inside sandbox")
	}
	// defer workDir.remove() // remove directory after job finished

	// extracting spec tar file
	specs, err := worker.extractSpec(ctx, *workDir, job.Spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot extract spec file")
	}

	// compile testcase generator
	tcgenExec, err := worker.compileTCGen(ctx, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error compiling testcase generator")
	}

	// generate testcase input
	tcin, err := worker.generateTCInputs(ctx, tcgenExec)
	if err != nil {
		return nil, errors.Wrap(err, "error generating testcase inputs")
	}

	// compile jury solution
	compiledJury, err := worker.compileJurySolution(ctx, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error compiling jury solution")
	}

	// generate testcase suite
	juryOutputs, err := worker.generateTCOutputs(ctx, *tcin, compiledJury)
	if err != nil {
		return nil, errors.Wrap(err, "error generating testcase outputs")
	}

	// compile contestant solution
	compiledContestant, err := worker.compileContestantSolution(ctx, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error compiling contestant solution")
	}

	// run contestant solution
	contestantOutputs, err := worker.generateContestantOutputs(ctx, *tcin, compiledContestant)
	if err != nil {
		return nil, errors.Wrap(err, "error executing contestant solution")
	}

	// compile checker
	compiledChecker, err := worker.compileChecker(ctx, *specs)
	if err != nil {
		return nil, errors.Wrap(err, "error compiling checker")
	}

	grading, err := worker.generateGrading(ctx, compiledChecker, *contestantOutputs, *juryOutputs)
	if err != nil {
		return nil, errors.Wrap(err, "error run checker")
	}

	return &grader.JobResult{
		Job:     job,
		Verdict: grading.verdict,
		Output:  ioutil.NopCloser(strings.NewReader("i just randomize the verdict and unfortunately you got WA")),
	}, nil
}
