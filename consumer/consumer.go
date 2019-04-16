package consumer

import (
	"context"
	"io/ioutil"
	"os"
	"strings"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/consumer/client"
	"github.com/jauhararifin/ugrade/jobsolver/solver"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type defaultConsumer struct {
	client client.Client
}

// New create default implementation of `ugrade.Consumer`
func New(serverURL string) ugrade.Consumer {
	return &defaultConsumer{
		client: client.New(serverURL),
	}
}

func (c *defaultConsumer) Consume(ctx context.Context, token string) error {
	// fetch job from server, maximum 10 seconds.
	logrus.Debug("asking for job to server")
	ctxGet, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	job, err := c.client.GetJob(ctxGet, token)
	if err != nil {
		return errors.Wrap(err, "cannot fetch job")
	}
	defer job.Spec.Close()
	defer ioutil.ReadAll(job.Spec)
	logrus.WithField("job", job).Info("found a job")

	// prepare directory for extracting job
	jobDir, err := ioutil.TempDir("", "ugrade-job-")
	if err != nil {
		err = errors.Wrap(err, "cannot create job directory")
		logrus.WithField("error", err).Error("cannot finish job")
		c.client.SubmitJob(ctx, token, client.JobResult{
			Job:     job,
			Verdict: "IE",
			Output:  ioutil.NopCloser(strings.NewReader(err.Error())),
		})
		return nil
	}
	defer os.RemoveAll(jobDir)

	// extracting job.
	ctxExtract, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	workerJobSpec, err := c.extractSpec(ctxExtract, jobDir, job.Spec)
	if err != nil {
		err = errors.Wrap(err, "cannot extract job")
		logrus.WithField("error", err).Error("cannot finish job")
		c.client.SubmitJob(ctx, token, client.JobResult{
			Job:     job,
			Verdict: "IE",
			Output:  ioutil.NopCloser(strings.NewReader(err.Error())),
		})
		return nil
	}
	logrus.WithField("jobSpec", *workerJobSpec).Debug("job extracted")

	// create solver instance
	workerSolver, err := solver.New()
	if err != nil {
		err = errors.Wrap(err, "cannot create job solver")
		logrus.WithField("error", err).Error("cannot finish job")
		c.client.SubmitJob(ctx, token, client.JobResult{
			Job:     job,
			Verdict: "IE",
			Output:  ioutil.NopCloser(strings.NewReader(err.Error())),
		})
		return nil
	}

	// solve job
	solverCtx, cancel := context.WithTimeout(ctx, 5*time.Minute)
	defer cancel()
	result, err := workerSolver.Solve(solverCtx, *workerJobSpec)
	if err != nil {
		logrus.WithField("error", err).Error("cannot finish job")
		c.client.SubmitJob(ctx, token, client.JobResult{
			Job:     job,
			Verdict: "IE",
			Output:  ioutil.NopCloser(strings.NewReader(err.Error())),
		})
		return nil
	}
	logrus.WithField("result", result).Info("job finished")

	// submit job
	c.client.SubmitJob(ctx, token, client.JobResult{
		Job:     job,
		Verdict: result.Verdict,
		Output:  ioutil.NopCloser(strings.NewReader("job finished successfully")),
	})
	return nil
}
