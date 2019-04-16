package jail

import (
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"syscall"

	"github.com/jauhararifin/ugrade"

	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

func (jl *defaultJail) Run(
	imagePath,
	workingDirectory string,
	uid,
	gid uint32,
	stdin,
	stdout,
	stderr,
	commandPath string,
	args []string,
) error {
	// change proces root to sandboxed directory.
	logrus.WithField("imagePath", imagePath).Debug("chrooting to sandboxed directory")
	if err := jl.fs.Chroot(imagePath); err != nil {
		return xerrors.Errorf("cannot chroot: %w", err)
	}

	// change working directory.
	logrus.WithField("workingDirectory", workingDirectory).Debug("change dir to working directory")
	if err := os.Chdir(workingDirectory); err != nil {
		return xerrors.Errorf("cannot change dir to working directory: %w", err)
	}

	// initialize child command.
	logrus.WithField("commandPath", commandPath).WithField("args", args).Debug("set child command")
	proc := exec.Command(commandPath, args...)
	proc.Stdin = ioutil.NopCloser(strings.NewReader(""))
	proc.Stdout = ioutil.Discard
	proc.Stderr = ioutil.Discard

	// open stdin file.
	logrus.WithField("stdin", stdin).Debug("preparing stdin file")
	if len(stdin) > 0 {
		file, err := os.OpenFile(stdin, os.O_RDONLY, 0774)
		if err != nil {
			return xerrors.Errorf("cannot open standard input file: %w", err)
		}
		defer file.Close()
		proc.Stdin = file
	}

	// open stdout file.
	logrus.WithField("stdout", stdout).Debug("preparing stdout file")
	if len(stdout) > 0 {
		file, err := os.OpenFile(stdout, os.O_WRONLY|os.O_CREATE, 0664)
		if err != nil {
			return xerrors.Errorf("cannot open standard output file: %w", err)
		}
		defer file.Close()
		proc.Stdout = file
	}

	// open stderr file.
	logrus.WithField("stderr", stderr).Debug("preparing stderr file")
	if len(stderr) > 0 {
		file, err := os.OpenFile(stderr, os.O_WRONLY|os.O_CREATE, 0664)
		if err != nil {
			return xerrors.Errorf("cannot open standard error file: %w", err)
		}
		proc.Stderr = file
		defer file.Close()
	}

	// clone namespaces for guard process.
	proc.SysProcAttr = &syscall.SysProcAttr{
		Cloneflags: syscall.CLONE_NEWUTS |
			syscall.CLONE_NEWIPC |
			syscall.CLONE_NEWPID |
			syscall.CLONE_NEWNS |
			syscall.CLONE_NEWNET,
		Credential: &syscall.Credential{Uid: uid, Gid: gid},
	}

	// TODO: remove harcoded env var, use image file instead
	proc.Env = []string{
		"PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/x86_64-alpine-linux-musl/bin/:/usr/libexec/gcc/x86_64-alpine-linux-musl/8.2.0",
	}

	// start process
	if err := proc.Start(); err != nil {
		return xerrors.Errorf("cannot start program: %w", err)
	}

	if err := proc.Wait(); err != nil {
		if exiterr, ok := err.(*exec.ExitError); ok {
			if _, ok := exiterr.Sys().(syscall.WaitStatus); ok {
				return ugrade.ErrRuntimeError
			}
			return xerrors.Errorf("cannot determine sandboxed process exit code: %w", err)
		}
		return xerrors.Errorf("error when executing program: %w", err)
	}

	return nil
}
