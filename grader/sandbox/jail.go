package sandbox

import (
	"context"
	"os"
	"os/exec"
	"syscall"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (sb *defaultSandbox) executeJail(ctx context.Context, cmd Command) error {
	// chroot to new sandbox directory.
	logrus.WithField("rootFSDir", sb.sandboxDir).Debug("chroot to new sandbox directory")
	if err := syscall.Chroot(sb.sandboxDir); err != nil {
		return errors.Wrap(err, "cannot chroot to sandbox directory")
	}
	logrus.Debug("chrooted into new sandbox directory")

	// change working directory to root, this avoid jailbreak.
	// http://pentestmonkey.net/blog/chroot-breakout-perl
	logrus.Debug("change current working directory to root")
	if err := os.Chdir("/"); err != nil {
		return errors.Wrap(err, "cannot cd to root directory")
	}
	logrus.Debug("current working directory changed to root directory")

	// run actual command
	logrus.WithField("path", cmd.Path).WithField("args", cmd.Args).Debug("running command")
	osCmd := exec.CommandContext(ctx, cmd.Path, cmd.Args...)
	osCmd.Stdin = os.Stdin
	osCmd.Stdout = os.Stdout
	osCmd.Stderr = os.Stderr
	osCmd.Dir = cmd.Dir.Sandbox
	osCmd.Env = []string{
		"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/usr/x86_64-alpine-linux-musl/bin/",
	}

	if err := osCmd.Run(); err != nil {
		return errors.Wrap(err, "program exited with error")
	}
	return nil
}
