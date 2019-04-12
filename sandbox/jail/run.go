package jail

import (
	"io/ioutil"
	"os"
	"os/exec"
	"strings"
	"syscall"

	"github.com/sirupsen/logrus"

	"github.com/pkg/errors"
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
	logrus.WithField("imagePath", imagePath).Debug("chrooting to sandboxed directory")
	if err := jl.fs.Chroot(imagePath); err != nil {
		return errors.Wrap(err, "cannot chroot")
	}

	logrus.WithField("workingDirectory", workingDirectory).Debug("change dir to working directory")
	if err := os.Chdir(workingDirectory); err != nil {
		return errors.Wrap(err, "cannot change dir to working directory")
	}

	logrus.WithField("commandPath", commandPath).WithField("args", args).Debug("set child command")
	proc := exec.Command(commandPath, args...)
	proc.Stdin = ioutil.NopCloser(strings.NewReader(""))
	proc.Stdout = ioutil.Discard
	proc.Stderr = ioutil.Discard

	logrus.WithField("stdin", stdin).Debug("preparing stdin file")
	if len(stdin) > 0 {
		file, err := os.OpenFile(stdin, os.O_RDONLY|os.O_SYNC, 0660)
		if err != nil {
			return errors.Wrap(err, "cannot open standard input file")
		}
		proc.Stdin = file
		defer file.Close()
	}

	logrus.WithField("stdout", stdout).Debug("preparing stdout file")
	if len(stdout) > 0 {
		file, err := os.OpenFile(stdout, os.O_WRONLY|os.O_CREATE|os.O_SYNC, 0660)
		if err != nil {
			return errors.Wrap(err, "cannot open standard output file")
		}
		proc.Stdout = file
		defer file.Close()
	}

	logrus.WithField("stderr", stderr).Debug("preparing stderr file")
	if len(stderr) > 0 {
		file, err := os.OpenFile(stderr, os.O_WRONLY|os.O_CREATE|os.O_SYNC, 0660)
		if err != nil {
			return errors.Wrap(err, "cannot open standard error file")
		}
		proc.Stderr = file
		defer file.Close()
	}

	// clone namespaces for guard process
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

	if err := proc.Start(); err != nil {
		return errors.Wrap(err, "cannot start program")
	}

	return proc.Wait()
}
