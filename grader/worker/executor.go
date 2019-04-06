package worker

import (
	"context"
	"io"
	"os"
	"os/exec"
	"path"
	"syscall"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// Command contain information to execute.
type Command struct {
	Path   string
	Args   []string
	Dir    string
	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer
}

func (wk *defaultWorker) executeCommand(ctx context.Context, cmd Command) error {
	executeChildArgs := append([]string{"sandbox", wk.rootFSDir, cmd.Path}, cmd.Args...)
	osCmd := exec.Command(
		"/proc/self/exe",
		executeChildArgs...,
	)
	osCmd.SysProcAttr = &syscall.SysProcAttr{
		Cloneflags: syscall.CLONE_NEWUTS | syscall.CLONE_NEWPID | syscall.CLONE_NEWNS,
	}
	osCmd.Stdin = cmd.Stdin
	osCmd.Stdout = cmd.Stdout
	osCmd.Stderr = cmd.Stderr
	osCmd.Dir = cmd.Dir

	logrus.WithField("cmd", cmd).Info("executing sandboxed command")
	if err := osCmd.Run(); err != nil {
		return errors.Wrap(err, "error when executing child process")
	}

	return nil
}

// ExecuteChild executed by the child process
func ExecuteChild(rootFSDir string) error {
	// mount root directory
	if err := syscall.Mount(rootFSDir, rootFSDir, "", syscall.MS_BIND, ""); err != nil {
		return errors.Wrap(err, "cannot mount root filesystem")
	}

	// chroot to new root directory. put current root FS to `rootFSDir`/oldroot then chroot to `rootFSDir`
	oldPath := path.Join(rootFSDir, "oldroot")
	if err := os.MkdirAll(oldPath, 0700); err != nil {
		return errors.Wrap(err, "cannot create dir for storing old filesystem")
	}
	if err := syscall.PivotRoot(rootFSDir, oldPath); err != nil {
		return errors.Wrap(err, "cannot change root to rootFS")
	}

	// change working directory to root, this avoid jailbreak. http://pentestmonkey.net/blog/chroot-breakout-perl
	if err := os.Chdir("/"); err != nil {
		return errors.Wrap(err, "cannot cd to root directory")
	}

	// run actual command
	cmd := exec.Command(os.Args[2], os.Args[3:]...)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if err := cmd.Run(); err != nil {
		return errors.Wrap(err, "program exited with error")
	}
	return nil
}
