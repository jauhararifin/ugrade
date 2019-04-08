package sandbox

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"syscall"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (sb *defaultSandbox) ExecuteCommand(ctx context.Context, cmd Command) error {
	// prepare arguments for child process
	executeChildArgs := append([]string{
		"ugsbox",
		"--working-directory", cmd.Dir.Sandbox,
		"--path", cmd.Path,
		"--timelimit", fmt.Sprintf("%d", cmd.TimeLimit),
		"--memorylimit", fmt.Sprintf("%d", cmd.MemoryLimit),
		"--",
	}, cmd.Args...)

	// initialize child process
	osCmd := exec.CommandContext(
		ctx,
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
		Cloneflags: syscall.CLONE_NEWUTS | syscall.CLONE_NEWPID | syscall.CLONE_NEWNS,
	}

	// executing child command
	logrus.WithField("cmd", cmd).Debug("executing sandboxed command")
	if err := osCmd.Run(); err != nil {
		return errors.Wrap(err, "error when executing child process")
	}
	return nil
}
