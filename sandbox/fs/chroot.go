package fs

import (
	"syscall"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// Chroot change root into new directory, set uid and gid and working directory.
// `imagePath` contain path to the image file (the compressed image file, not the output)
func (fs *defaultFS) Chroot(imagePath string) error {
	sandboxPath, err := imageSandboxPath(imagePath)
	if err != nil {
		return errors.Wrap(err, "cannot determine image sandbox path")
	}

	logrus.WithField("path", sandboxPath).Debug("chroot to sandbox directory")
	if err := syscall.Chroot(sandboxPath); err != nil {
		return errors.Wrap(err, "cannot chroot to path")
	}

	logrus.Debug("change working directory to /")
	if err := syscall.Chdir("/"); err != nil {
		return errors.Wrap(err, "cannot change directory to root")
	}
	return nil
}
