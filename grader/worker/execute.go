package worker

import (
	"context"
	"io/ioutil"
	"math/rand"
	"strings"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (worker *defaultWorker) Execute(ctx context.Context, job grader.Job) (*grader.JobResult, error) {
	// prepare working directory
	logrus.Debug("preparing working directory for executing job")
	workDir, workDirSbox, err := worker.executor.PrepareDir()
	if err != nil {
		return nil, errors.Wrap(err, "cannot create working directory inside sandbox")
	}
	// defer os.RemoveAll(workDir) // remove directory after job finished
	logrus.WithField("workDir", workDir).WithField("workDirSbox", workDirSbox).Debug("working directory created")

	logrus.Debug("extracting spec file")
	specs, err := extractSpec(ctx, workDir, job.Spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot extract spec file")
	}
	logrus.Debug("spec file extracted")

	logrus.Debug("compiling testcase generator")
	tcgenCompRes, err := worker.compile(ctx, workDirSbox, specs.tcgen.language, specs.tcgen.filename, "tcgenexec")
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile testcase generator")
	}
	logrus.WithField("compileResult", tcgenCompRes).Debug("testcase generator compiled")

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
