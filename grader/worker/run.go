package worker

import (
	"context"
	"io"
	"os"
	"path"
	"time"

	"github.com/jauhararifin/ugrade/grader/sandbox"
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
	timelimit,
	memlimit uint32,
) (executionResult, error) {
	cmd := sandbox.Command{
		Path:           path.Join(compiled.workDir.Sandbox, compiled.executable),
		Args:           args,
		Dir:            compiled.workDir,
		Stdin:          stdin,
		Stdout:         stdout,
		Stderr:         os.Stderr,
		TimeLimit:      timelimit,
		MemoryLimit:    memlimit,
		MemoryThrottle: memlimit + 64*1024*1024, // throttle memory to (memlimit + 64MB)
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
	timelimit,
	memlimit uint32,
) (executionResult, error) {
	hostInput := path.Join(compiled.workDir.Host, inputFile)
	in, err := os.Open(hostInput)
	if err != nil {
		return executionResult{}, errors.Wrap(err, "cannot open stdin")
	}

	hostOutput := path.Join(compiled.workDir.Host, outputFile)
	out, err := os.Create(hostOutput)
	if err != nil {
		return executionResult{}, errors.Wrap(err, "cannot create stdout")
	}

	return worker.run(ctx, compiled, args, in, out, timelimit, memlimit)
}
