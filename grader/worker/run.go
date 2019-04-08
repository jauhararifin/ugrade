package worker

import (
	"context"
	"io"
	"path"
	"time"

	"github.com/jauhararifin/ugrade/grader"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type executionResult struct {
	duration time.Duration
}

func (worker *defaultWorker) run(
	ctx context.Context,
	compiled compilationResult,
	args []string,
	stdin io.Reader,
	stdout io.Writer,
) (executionResult, error) {
	cmd := grader.Command{
		Path:   path.Join(compiled.workDir.sandboxPath, compiled.executable),
		Args:   args,
		Dir:    compiled.workDir.sandboxPath,
		Stdin:  stdin,
		Stdout: stdout,
	}

	logrus.WithField("cmd", cmd).Trace("run executable")
	startTime := time.Now()
	if err := worker.executor.ExecuteCommand(ctx, cmd); err != nil {
		return executionResult{
			duration: time.Since(startTime),
		}, errors.Wrap(err, "error when running executable")
	}
	duration := time.Since(startTime)
	logrus.Trace("successfully ran executable")

	return executionResult{
		duration: duration,
	}, nil
}
