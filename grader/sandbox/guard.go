package sandbox

import (
	"context"
	"os"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade/grader/sandbox/blkio"

	"github.com/jauhararifin/ugrade/grader/sandbox/memory"

	"github.com/pkg/errors"
)

func (sb *defaultSandbox) executeGuard(ctx context.Context, cmd Command) error {
	// limit memory throttle using cgroup
	memlimiter := memory.Limiter{
		Name:     "ugrade-sandbox-memlimit",
		Limit:    cmd.MemoryLimit,
		Throttle: cmd.MemoryThrottle,
	}
	if err := memlimiter.Prepare(); err != nil {
		return errors.Wrap(err, "cannot preparing memory limiter")
	}
	memoryCtx := memlimiter.Context(ctx)

	// limit blkio
	blkiolimiter := blkio.Limiter{
		Name: "ugrade-sandbox-blkio",
	}
	if err := blkiolimiter.Prepare(); err != nil {
		return errors.Wrap(err, "cannot preparing block io limiter")
	}
	// TODO: remove hardcoded limit
	if err := blkiolimiter.LimitWrite(sb.workingDir, 25*1025*1024); err != nil { // hardcoded limit to 25MB
		return errors.Wrap(err, "cannot set blkio write speed limit")
	}
	if err := blkiolimiter.LimitRead(sb.workingDir, 25*1025*1024); err != nil { // hardcoded limit to 25MB
		return errors.Wrap(err, "cannot set blkio read speed limit")
	}
	if cmd.OpenFile > 0 {
		if err := blkiolimiter.LimitOpenFile(cmd.OpenFile); err != nil {
			return errors.Wrap(err, "cannot set open file limit")
		}
	}
	if cmd.FileSize > 0 {
		if err := blkiolimiter.LimitSize(cmd.FileSize); err != nil { // limit generated file sisze
			return errors.Wrap(err, "cannot set generate file limit")
		}
	}

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
