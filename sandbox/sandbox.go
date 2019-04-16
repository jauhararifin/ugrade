package sandbox

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

type defaultSandbox struct{}

// New create default implementation of `Executor`
func New() ugrade.Sandbox {
	return &defaultSandbox{}
}

func (*defaultSandbox) Execute(ctx context.Context, command ugrade.Command) (ugrade.Usage, error) {
	if len(command.Dir) == 0 {
		command.Dir = "/"
	}

	args := []string{
		"guard",
		"--image", command.ImagePath,
	}

	if command.TimeLimit > 0 {
		args = append(args, "--time-limit", fmt.Sprintf("%d", command.TimeLimit))
	}

	if command.MemoryLimit > 0 {
		args = append(args, "--memory-limit", fmt.Sprintf("%d", command.MemoryLimit))
	}

	if command.MemoryThrottle > 0 {
		args = append(args, "--memory-throttle", fmt.Sprintf("%d", command.MemoryThrottle))
	}

	if command.FileSize > 0 {
		args = append(args, "--file-size", fmt.Sprintf("%d", command.FileSize))
	}

	if command.OpenFile > 0 {
		args = append(args, "--open-file", fmt.Sprintf("%d", command.OpenFile))
	}

	if command.NProc > 0 {
		args = append(args, "--nproc", fmt.Sprintf("%d", command.NProc))
	}

	if command.StackSize > 0 {
		args = append(args, "--stack-size", fmt.Sprintf("%d", command.StackSize))
	}

	if len(command.Dir) > 0 {
		args = append(args, "--working-directory", command.Dir)
	}

	if len(command.Stdin) > 0 {
		args = append(args, "--stdin", command.Stdin)
	}

	if len(command.Stdout) > 0 {
		args = append(args, "--stdout", command.Stdout)
	}

	if len(command.Stderr) > 0 {
		args = append(args, "--stderr", command.Stderr)
	}

	for _, bnd := range command.Binds {
		args = append(args, "--bind", bnd.Host+":"+bnd.Sandbox)
	}
	args = append(args, "--", command.Path)
	args = append(args, command.Args...)

	exe := exec.CommandContext(ctx, "ugsbox", args...)

	var stdout bytes.Buffer
	exe.Stdout = &stdout

	err := exe.Run()

	usage := ugrade.Usage{}
	fmt.Fscanf(&stdout, "cpu: %d\n", &usage.CPU)
	fmt.Fscanf(&stdout, "memory: %d\n", &usage.Memory)
	fmt.Fscanf(&stdout, "wallClock: %d\n", &usage.WallTime)
	if err != nil {
		if exiterr, ok := err.(*exec.ExitError); ok {
			if status, ok := exiterr.Sys().(syscall.WaitStatus); ok {
				switch status.ExitStatus() {
				case ExitCodeMemoryLimitExceeded:
					return usage, ugrade.ErrMemoryLimitExceeded
				case ExitCodeTimeLimitExceeded:
					return usage, ugrade.ErrTimeLimitExceeded
				case ExitCodeRuntimeError:
					return usage, ugrade.ErrRuntimeError
				case ExitCodeInternalError:
					return usage, ugrade.ErrInternalError
				}
				return usage, xerrors.Errorf("cannot determine process exit code: %w", err)
			}
			return usage, xerrors.Errorf("cannot cast error to `syscall.WaitStatus`: %w", err)
		}
	}

	return usage, nil
}
