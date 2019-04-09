package sandbox

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"syscall"
	"time"

	"github.com/sirupsen/logrus"
)

func (sb *defaultSandbox) ExecuteCommand(ctx context.Context, cmd Command) error {
	// prepare arguments for child process
	executeChildArgs := append([]string{
		"sandbox",
		"--working-directory", cmd.Dir.Sandbox,
		"--path", cmd.Path,
		"--timelimit", fmt.Sprintf("%d", cmd.TimeLimit),
		"--memorylimit", fmt.Sprintf("%d", cmd.MemoryLimit),
		"--",
	}, cmd.Args...)

	timelimitCtx, cancelTimelimitCtx := context.WithTimeout(ctx, time.Duration(cmd.TimeLimit)*time.Millisecond)
	defer cancelTimelimitCtx()

	// initialize child process
	osCmd := exec.CommandContext(
		timelimitCtx,
		"/proc/self/exe",
		executeChildArgs...,
	)
	osCmd.Stdin = cmd.Stdin
	osCmd.Stdout = cmd.Stdout
	osCmd.Stderr = cmd.Stderr

	if osCmd.Stderr == nil {
		osCmd.Stderr = os.Stderr
	}

	// clone namespaces for child process
	osCmd.SysProcAttr = &syscall.SysProcAttr{
		Cloneflags: syscall.CLONE_NEWUTS |
			syscall.CLONE_NEWIPC |
			syscall.CLONE_NEWPID |
			syscall.CLONE_NEWNS |
			// syscall.CLONE_NEWUSER |
			syscall.CLONE_NEWNET,
	}

	// executing child command
	logrus.WithField("cmd", cmd).Debug("executing sandboxed command")
	if err := osCmd.Run(); err != nil {
		if timelimitCtx.Err() != nil {
			return ErrTimeLimitExceeded
		}
		return ErrRuntimeError
	}
	return nil
}
