package worker

import (
	"context"
	"fmt"
	"io/ioutil"
	"math/rand"
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
	inputs, err := worker.generateTCInput(ctx, tcgenExec)
	if err != nil {
		return nil, errors.Wrap(err, "error generating testcase inputs")
	}
	fmt.Println(inputs)

	ioutil.ReadAll(job.Spec)
	job.Spec.Close()

	if rand.Intn(2) == 0 {
		return &grader.JobResult{
			Job:     job,
			Verdict: grader.AC,
			Output:  ioutil.NopCloser(strings.NewReader("i just randomize the verdict and voila, you got AC")),
		}, nil
	}
	return &grader.JobResult{
		Job:     job,
		Verdict: grader.WA,
		Output:  ioutil.NopCloser(strings.NewReader("i just randomize the verdict and unfortunately you got WA")),
	}, nil
}
