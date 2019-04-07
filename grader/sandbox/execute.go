package sandbox

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (sb *defaultSandbox) ExecuteCommand(ctx context.Context, cmd grader.Command) error {
	// prepare arguments for child process
	executeChildArgs := append([]string{
		"sandbox",
		cmd.Dir,
		"--",
		cmd.Path,
	}, cmd.Args...)

	// initialize child process
	var stderr bytes.Buffer
	osCmd := exec.CommandContext(
		ctx,
		"/proc/self/exe",
		executeChildArgs...,
	)
	osCmd.Stderr = &stderr

	// clone namespaces for child process
	osCmd.SysProcAttr = &syscall.SysProcAttr{
		Cloneflags: syscall.CLONE_NEWUTS | syscall.CLONE_NEWPID | syscall.CLONE_NEWNS,
	}

	// executing child command
	logrus.WithField("cmd", cmd).Debug("executing sandboxed command")
	if err := osCmd.Run(); err != nil {
		b, _ := ioutil.ReadAll(&stderr)
		fmt.Println(string(b))

		return errors.Wrap(err, "error when executing child process")
	}
	return nil
}

func (sb *defaultSandbox) ExecuteChild(ctx context.Context, cmd grader.Command) error {
	// mount dev filesystem
	// logrus.WithField("rootFSDir", sb.sandboxDir).Debug("mounting dev filesystem")
	// targetDev := path.Join(sb.sandboxDir, "/dev")
	// if err := os.MkdirAll(targetDev, 0700); err != nil {
	// 	return errors.Wrap(err, "cannot create dev folder inside sandbox")
	// }
	// if err := syscall.Mount("/dev", targetDev, "", syscall.MS_BIND, ""); err != nil {
	// 	return errors.Wrap(err, "cannot mount dev filesystem into sandbox")
	// }
	// defer syscall.Unmount(targetDev, 0) // should we unmount again?
	// logrus.Debug("dev filesystem mounted into sandbox")

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
	logrus.WithField("path", cmd.Path).WithField("args", cmd.Args).Debug("runing command")
	osCmd := exec.CommandContext(ctx, cmd.Path, cmd.Args...)
	osCmd.Stdin = os.Stdin
	osCmd.Stdout = os.Stdout
	osCmd.Stderr = os.Stderr
	osCmd.Dir = cmd.Dir
	osCmd.Env = []string{
		"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/snap/bin:/usr/x86_64-alpine-linux-musl/bin/",
	}

	if err := osCmd.Run(); err != nil {
		return errors.Wrap(err, "program exited with error")
	}

	return nil
}
