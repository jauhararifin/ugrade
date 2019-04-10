package sandbox

import (
	"context"
	"os"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade/grader/sandbox/cpu"
	"github.com/jauhararifin/ugrade/grader/sandbox/rlimit"

	"github.com/jauhararifin/ugrade/grader/sandbox/memory"

	"github.com/pkg/errors"
)

// TODO: use rlimit to limit memory,stack size,memlock,core,nproc
// TODO: limit blkio device
// TODO: set userid to nonroot when execute process
// TODO: chown all files in sandboxed dir
// TODO: add capability to isolate folder, so contestant binary cannot use other program like g++
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

	// limit cpu throttle using cgroup
	cpulimiter := cpu.Limiter{
		Name:  "ugrade-sandbox-cpulimit",
		Limit: cmd.TimeLimit,
	}
	if err := cpulimiter.Prepare(); err != nil {
		return errors.Wrap(err, "cannot preparing cpu limiter")
	}
	cpuCtx := cpulimiter.Context(memoryCtx)

	// limit blkio
	// blkiolimiter := blkio.Limiter{
	// 	Name: "ugrade-sandbox-blkio",
	// }
	// if err := blkiolimiter.Prepare(); err != nil {
	// 	return errors.Wrap(err, "cannot preparing block io limiter")
	// }
	// TODO: remove hardcoded limit
	// TODO: implement this. Actually this block io limiter is not working.
	// if err := blkiolimiter.LimitWrite(sb.workingDir, 25*1025*1024); err != nil { // hardcoded limit to 25MB
	// 	return errors.Wrap(err, "cannot set blkio write speed limit")
	// }
	// if err := blkiolimiter.LimitRead(sb.workingDir, 25*1025*1024); err != nil { // hardcoded limit to 25MB
	// 	return errors.Wrap(err, "cannot set blkio read speed limit")
	// }
	if cmd.OpenFile > 0 {
		if err := rlimit.LimitOpenFile(cmd.OpenFile); err != nil {
			return errors.Wrap(err, "cannot set open file limit")
		}
	}
	if cmd.FileSize > 0 {
		if err := rlimit.LimitFSize(cmd.FileSize); err != nil { // limit generated file sisze
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
	osCmd := exec.CommandContext(cpuCtx, "/proc/self/exe", executeJailArgs...)
	osCmd.Stdin = os.Stdin
	osCmd.Stdout = os.Stdout
	osCmd.Stderr = os.Stderr

	// clone namespaces for guard process
	osCmd.SysProcAttr = &syscall.SysProcAttr{
		Cloneflags: syscall.CLONE_NEWUTS |
			syscall.CLONE_NEWIPC |
			syscall.CLONE_NEWPID |
			syscall.CLONE_NEWNS |
			syscall.CLONE_NEWNET,
	}

	// starting jail process to get its pid
	if err := osCmd.Start(); err != nil {
		return errors.Wrap(err, "cannot start jail process")
	}

	// assign jail pid to memory limiter
	if err := memlimiter.Put(osCmd.Process); err != nil {
		return errors.Wrap(err, "cannot assign jail process to memory limiter")
	}

	// assign jail pid to cpu limiter
	if err := cpulimiter.Put(osCmd.Process); err != nil {
		return errors.Wrap(err, "cannot assign jail process to cpu limiter")
	}

	// wait program to exit
	if err := osCmd.Wait(); err != nil {
		if cpuCtx.Err() != nil {
			return ErrTimeLimitExceeded
		}
		if memoryCtx.Err() != nil {
			return ErrMemoryLimitExceeded
		}
		return errors.Wrap(err, "program exited with error")
	}

	return nil
}
