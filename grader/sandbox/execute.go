package sandbox

import (
	"context"
	"fmt"
	"os/exec"

	"github.com/sirupsen/logrus"
)

func (sb *defaultSandbox) ExecuteCommand(ctx context.Context, cmd Command) error {
	// prepare arguments for guard process
	executeGuardArgs := append([]string{
		"sandbox",
		"guard",
		"--working-directory", cmd.Dir.Sandbox,
		"--path", cmd.Path,
		"--time-limit", fmt.Sprintf("%d", cmd.TimeLimit.Nanoseconds()/1000000),
		"--memory-limit", fmt.Sprintf("%d", cmd.MemoryLimit),
		"--memory-throttle", fmt.Sprintf("%d", cmd.MemoryThrottle),
		"--file-size", fmt.Sprintf("%d", cmd.FileSize),
		"--",
	}, cmd.Args...)

	// initialize guard process
	osCmd := exec.CommandContext(
		ctx,
		"/proc/self/exe",
		executeGuardArgs...,
	)

	// fill stdin, stdout and stderr of guard process.
	osCmd.Stdin = cmd.Stdin
	osCmd.Stdout = cmd.Stdout
	osCmd.Stderr = cmd.Stderr

	// executing guard command
	logrus.WithField("cmd", cmd).Debug("executing sandboxed command")
	if err := osCmd.Run(); err != nil {
		if exitErr, ok := err.(*exec.ExitError); ok {
			exitCode := exitErr.ExitCode()
			if exitCode == ExitCodeMemoryLimitExceeded {
				return ErrMemoryLimitExceeded
			} else if exitCode == ExitCodeTimeLimitExceeded {
				return ErrTimeLimitExceeded
			}
		}
		return ErrRuntimeError
	}

	return nil
}
