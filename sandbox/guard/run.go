package guard

import (
	"context"
	"os"
	"os/exec"
	"syscall"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/uid"
	"golang.org/x/xerrors"
)

type errTLE struct{ error }

func (*errTLE) TimeLimitExceeded() bool {
	return true
}

func (guard *defaultGuard) Run(ctx context.Context, cmd ugrade.Command) (ugrade.Usage, error) {
	// extract image
	if err := guard.fs.Load(cmd.ImagePath, uid.AnonymousUID, uid.AnonymousUID); err != nil {
		return ugrade.Usage{}, xerrors.Errorf("cannot prepare sandboxed directory: %w", err)
	}

	// limit memory
	if err := guard.cgrp.LimitMemory(cmd.MemoryLimit); err != nil {
		return ugrade.Usage{}, xerrors.Errorf("cannot set memory limit of cgroup: %w", err)
	}

	// throttle memory
	if err := guard.cgrp.ThrottleMemory(cmd.MemoryThrottle); err != nil {
		return ugrade.Usage{}, xerrors.Errorf("cannot set memory throttle: %w", err)
	}

	// limit cpu time
	if err := guard.cgrp.LimitCPU(cmd.TimeLimit); err != nil {
		return ugrade.Usage{}, xerrors.Errorf("cannot set cpu time limit: %w", err)
	}

	// limit open file
	if cmd.OpenFile > 0 {
		if err := guard.rlim.LimitOpenFile(cmd.OpenFile); err != nil {
			return ugrade.Usage{}, xerrors.Errorf("cannot set open file limit: %w", err)
		}
	}

	// limit fsize
	if cmd.FileSize > 0 {
		if err := guard.rlim.LimitFSize(cmd.FileSize); err != nil { // limit generated file sisze
			return ugrade.Usage{}, xerrors.Errorf("cannot set generate file limit: %w", err)
		}
	}

	// limit number of process
	if cmd.NProc > 0 {
		if err := guard.rlim.LimitNProcess(cmd.NProc); err != nil {
			return ugrade.Usage{}, xerrors.Errorf("cannot limit process creation: %w", err)
		}
	}

	// limit stack size
	if cmd.StackSize > 0 {
		if err := guard.rlim.LimitStack(cmd.StackSize); err != nil {
			return ugrade.Usage{}, xerrors.Errorf("cannot limit stack size: %w", err)
		}
	}

	// bind some filesystem
	for _, bind := range cmd.Binds {
		unbind, err := guard.fs.Bind(cmd.ImagePath, bind, uid.AnonymousUID, uid.AnonymousUID)
		if err != nil {
			return ugrade.Usage{}, xerrors.Errorf("cannot bind %s:%s: %w", bind.Host, bind.Sandbox, err)
		}
		defer unbind()
	}

	// create arguments for running jail
	jailArgs := []string{
		"jail",
		"--trace",
		"--image", cmd.ImagePath,
		"--working-directory", cmd.Dir,
	}

	if len(cmd.Stdin) > 0 {
		jailArgs = append(jailArgs, "--stdin", cmd.Stdin)
	}
	if len(cmd.Stdout) > 0 {
		jailArgs = append(jailArgs, "--stdout", cmd.Stdout)
	}
	if len(cmd.Stderr) > 0 {
		jailArgs = append(jailArgs, "--stderr", cmd.Stderr)
	}
	jailArgs = append(jailArgs, "--", cmd.Path)
	jailArgs = append(jailArgs, cmd.Args...)

	// limit wall time
	wallTimeCtx := ctx
	startTime := time.Now()
	if cmd.WallTimeLimit > 0 {
		var cancel context.CancelFunc
		wallTimeCtx, cancel = context.WithTimeout(wallTimeCtx, cmd.WallTimeLimit)
		defer cancel()
	}

	// initialize jail process
	monitorCtx := guard.cgrp.Monitor(wallTimeCtx)
	osCmd := exec.CommandContext(monitorCtx, "/proc/self/exe", jailArgs...)
	osCmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	osCmd.Stdin = os.Stdin
	osCmd.Stdout = os.Stdout
	osCmd.Stderr = os.Stderr

	// starting jail process to get its pid
	if err := osCmd.Start(); err != nil {
		return ugrade.Usage{}, xerrors.Errorf("cannot start jail process: %w", err)
	}

	// put process to cgroup monitor
	if err := guard.cgrp.Put(osCmd.Process); err != nil {
		return ugrade.Usage{}, xerrors.Errorf("cannot put process to cgroup monitor: %w", err)
	}

	// wait process to exit
	err := osCmd.Wait()
	wallDuration := time.Since(startTime)
	usage := ugrade.Usage{
		Memory:   guard.cgrp.Usage().Memory,
		CPU:      guard.cgrp.Usage().CPU,
		WallTime: wallDuration,
	}

	// check process errors
	if err != nil {
		// check wall time limit exceeded
		if wallTimeCtx.Err() != nil {
			return usage, ugrade.ErrTimeLimitExceeded
		}

		// check memory limit exceeded
		if xerrors.Is(guard.cgrp.Error(), ugrade.ErrMemoryLimitExceeded) {
			return usage, ugrade.ErrMemoryLimitExceeded
		}

		// check time limit exceeded
		if xerrors.Is(guard.cgrp.Error(), ugrade.ErrTimeLimitExceeded) {
			return usage, ugrade.ErrTimeLimitExceeded
		}

		// check runtime error
		if exiterr, ok := err.(*exec.ExitError); ok {
			if status, ok := exiterr.Sys().(syscall.WaitStatus); ok &&
				status.ExitStatus() == sandbox.ExitCodeRuntimeError {
				return usage, ugrade.ErrRuntimeError
			}
			return usage, xerrors.Errorf("cannot determine jailed process exit code: %w", err)
		}

		return usage, xerrors.Errorf("program exited with error: %w", err)
	}

	return usage, nil
}
