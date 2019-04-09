package sandbox

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"os/exec"
	"path"
	"syscall"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (sb *defaultSandbox) ExecuteChild(ctx context.Context, cmd Command) error {
	// limit memory using cgroup
	cgroupPath := "/sys/fs/cgroup/"
	cgroupMemPath := path.Join(cgroupPath, "memory", "ugrade-sandbox")
	logrus.WithField("path", cgroupMemPath).Debug("creating cgroup")
	if err := os.MkdirAll(cgroupMemPath, 0755); err != nil {
		return errors.Wrap(err, "cannot create ugrade-sandbox memory cgroup")
	}
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "memory.limit_in_bytes"),
		[]byte(fmt.Sprintf("%d", cmd.MemoryLimit)),
		0700,
	); err != nil {
		return errors.Wrap(err, "cannot write memory limit to cgroup")
	}
	if err := ioutil.WriteFile(path.Join(cgroupMemPath, "notify_on_release"), []byte("1"), 0700); err != nil {
		return errors.Wrap(err, "cannot write to notify_on_release")
	}
	mypid := os.Getpid()
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "cgroup.procs"),
		[]byte(fmt.Sprintf("%d", mypid)),
		0700,
	); err != nil {
		return errors.Wrap(err, "cannot put process to cgroup")
	}

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
