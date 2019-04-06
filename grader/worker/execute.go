package worker

import (
	"context"
	"io/ioutil"
	"math/rand"
	"strings"

	"github.com/jauhararifin/ugrade/grader"
)

func (worker *defaultWorker) Execute(ctx context.Context, job grader.Job) (*grader.JobResult, error) {
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
