package guard

import (
	"context"
	"os"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/uid"
	"github.com/pkg/errors"
)

func (guard *defaultGuard) Run(ctx context.Context, cmd sandbox.Command) error {
	// extract image
	_, err := guard.fs.Load(cmd.ImagePath, uid.AnonymousUID, uid.AnonymousUID)
	if err != nil {
		return errors.Wrap(err, "cannot prepare sandboxed directory")
	}

	// limit memory
	if err := guard.cgrp.LimitMemory(cmd.MemoryLimit); err != nil {
		return errors.Wrap(err, "cannot set memory limit of cgroup")
	}

	// throttle memory
	if err := guard.cgrp.ThrottleMemory(cmd.MemoryThrottle); err != nil {
		return errors.Wrap(err, "cannot set memory throttle")
	}

	// limit cpu time
	if err := guard.cgrp.LimitCPU(cmd.TimeLimit); err != nil {
		return errors.Wrap(err, "cannot set cpu time limit")
	}

	// limit open file
	if cmd.OpenFile > 0 {
		if err := guard.rlim.LimitOpenFile(cmd.OpenFile); err != nil {
			return errors.Wrap(err, "cannot set open file limit")
		}
	}

	// limit fsize
	if cmd.FileSize > 0 {
		if err := guard.rlim.LimitFSize(cmd.FileSize); err != nil { // limit generated file sisze
			return errors.Wrap(err, "cannot set generate file limit")
		}
	}

	// limit number of process
	if cmd.NProc > 0 {
		if err := guard.rlim.LimitNProcess(cmd.NProc); err != nil {
			return errors.Wrap(err, "cannot limit process creation")
		}
	}

	// limit stack size
	if cmd.StackSize > 0 {
		if err := guard.rlim.LimitStack(cmd.StackSize); err != nil {
			return errors.Wrap(err, "cannot limit stack size")
		}
	}

	// create arguments for running jail
	jailArgs := append([]string{
		"jail",
		"--image", cmd.ImagePath,
		"--working-directory", cmd.Dir,
		"--",
		cmd.Path,
	}, cmd.Args...)

	// initialize jail process
	monitorCtx := guard.cgrp.Monitor(ctx)
	osCmd := exec.CommandContext(monitorCtx, "/proc/self/exe", jailArgs...)
	osCmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	osCmd.Stdin = os.Stdin
	osCmd.Stdout = os.Stdout
	osCmd.Stderr = os.Stderr

	// starting jail process to get its pid
	if err := osCmd.Start(); err != nil {
		return errors.Wrap(err, "cannot start jail process")
	}

	// put process to cgroup monitor
	if err := guard.cgrp.Put(osCmd.Process); err != nil {
		return errors.Wrap(err, "cannot put process to cgroup monitor")
	}

	// wait program to exit
	if err := osCmd.Wait(); err != nil {
		if _, ok := errors.Cause(guard.cgrp.Error()).(sandbox.MemoryLimitExceeded); ok {
			return errors.Cause(guard.cgrp.Error())
		}
		if _, ok := errors.Cause(guard.cgrp.Error()).(sandbox.TimeLimitExceeded); ok {
			return errors.Cause(guard.cgrp.Error())
		}
		return errors.Wrap(err, "program exited with error")
	}

	return nil
}
