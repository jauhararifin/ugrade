package sandbox

import (
	"context"
	"os"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade/grader/sandbox/memory"

	"github.com/pkg/errors"
)

func (sb *defaultSandbox) executeGuard(ctx context.Context, cmd Command) error {
	// limit memory throttle using cgroup
	memlimiter := memory.Limiter{
		Name:     "ugrade-sandbox",
		Limit:    cmd.MemoryLimit,
		Throttle: cmd.MemoryThrottle,
	}
	if err := memlimiter.Prepare(); err != nil {
		return errors.Wrap(err, "cannot preparing memory limiter")
	}
	memoryCtx := memlimiter.Context(ctx)

	// prepare jail arguments
	executeJailArgs := append([]string{
		"sandbox",
		"jail",
		"--working-directory", cmd.Dir.Sandbox,
		"--path", cmd.Path,
		"--",
	}, cmd.Args...)

	// initialize jail process
	osCmd := exec.CommandContext(memoryCtx, "/proc/self/exe", executeJailArgs...)
	osCmd.Stdin = os.Stdin
	osCmd.Stdout = os.Stdout
	osCmd.Stderr = os.Stderr

	// clone namespaces for guard process
	osCmd.SysProcAttr = &syscall.SysProcAttr{
		Cloneflags: syscall.CLONE_NEWUTS |
			syscall.CLONE_NEWIPC |
			syscall.CLONE_NEWPID |
			syscall.CLONE_NEWNS |
			// syscall.CLONE_NEWUSER |
			syscall.CLONE_NEWNET,
	}

	// starting jail process to get its pid
	if err := osCmd.Start(); err != nil {
		return errors.Wrap(err, "cannot start jail process")
	}

	// assign jail pid to memory subsystem
	if err := memlimiter.Put(osCmd.Process); err != nil {
		return errors.Wrap(err, "cannot assign jail process to memory limiter")
	}

	// wait program to exit
	if err := osCmd.Wait(); err != nil {
		if memoryCtx.Err() != nil {
			return ErrMemoryLimitExceeded
		}
		return errors.Wrap(err, "program exited with error")
	}

	return nil
}
