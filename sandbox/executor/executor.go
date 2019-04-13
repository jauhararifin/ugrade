package executor

import (
	"context"
	"fmt"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/pkg/errors"
)

// Executor execute ugsbox
type Executor interface {
	Execute(ctx context.Context, command sandbox.Command) error
}

type defaultExecutor struct{}

// New create default implementation of `Executor`
func New() Executor {
	return &defaultExecutor{}
}

func (*defaultExecutor) Execute(ctx context.Context, command sandbox.Command) error {
	args := []string{
		"guard",
		"--time-limit", fmt.Sprintf("%d", command.TimeLimit),
		"--memory-limit", fmt.Sprintf("%d", command.MemoryLimit),
		"--memory-throttle", fmt.Sprintf("%d", command.MemoryThrottle),
		"--file-size", fmt.Sprintf("%d", command.FileSize),
		"--open-file", fmt.Sprintf("%d", command.OpenFile),
		"--nproc", fmt.Sprintf("%d", command.NProc),
		"--stack-size", fmt.Sprintf("%d", command.StackSize),
		"--working-directory", command.Dir,
		"--stdin", command.Stdin,
		"--stdout", command.Stdout,
		"--stderr", command.Stderr,
		"--image", command.ImagePath,
	}
	for _, bnd := range command.Binds {
		args = append(args, "--bind", bnd.Host+":"+bnd.Sandbox)
	}
	args = append(args, "--", command.Path)
	args = append(args, command.Args...)

	exe := exec.CommandContext(ctx, "ugsbox", args...)

	if err := exe.Run(); err != nil {
		if exiterr, ok := err.(*exec.ExitError); ok {
			if status, ok := exiterr.Sys().(syscall.WaitStatus); ok {
				switch status {
				case sandbox.ExitCodeMemoryLimitExceeded:
					return errMLE
				case sandbox.ExitCodeTimeLimitExceeded:
					return errTLE
				case sandbox.ExitCodeRuntimeError:
					return errRTE
				case sandbox.ExitCodeInternalError:
					return errIE
				}
			}
			return errors.Wrap(err, "cannot determine process exit code")
		}
	}

	return nil
}
