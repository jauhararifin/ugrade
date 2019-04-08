package worker

import (
	"context"
	"io"
	"os"
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

// runWithFile run compiled executable using `inputFile` as stdin, and create new `outputFile` file as stdout.
// `inputFile` and `outputFile` is relative to compiled directory.
func (worker *defaultWorker) runWithFile(
	ctx context.Context,
	compiled compilationResult,
	args []string,
	inputFile string,
	outputFile string,
) (executionResult, error) {
	hostInput := path.Join(compiled.workDir.hostPath, inputFile)
	in, err := os.Open(hostInput)
	if err != nil {
		return executionResult{}, errors.Wrap(err, "cannot open stdin")
	}

	hostOutput := path.Join(compiled.workDir.hostPath, outputFile)
	out, err := os.Create(hostOutput)
	if err != nil {
		return executionResult{}, errors.Wrap(err, "cannot create stdout")
	}

	return worker.run(ctx, compiled, args, in, out)
}
