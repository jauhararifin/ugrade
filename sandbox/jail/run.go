package jail

import (
	"os"
	"os/exec"
	"syscall"

	"github.com/pkg/errors"
)

func (jl *defaultJail) Run(imagePath, workingDirectory string, uid, gid uint32, commandPath string, args []string) error {
	if err := jl.fs.Chroot(imagePath); err != nil {
		return errors.Wrap(err, "cannot chroot")
	}

	if err := os.Chdir(workingDirectory); err != nil {
		return errors.Wrap(err, "cannot change dir to working directory")
	}

	proc := exec.Command(commandPath, args...)
	proc.Stdin = os.Stdin
	proc.Stdout = os.Stdout
	proc.Stderr = os.Stderr

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
