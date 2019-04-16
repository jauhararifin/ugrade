package fs

import (
	"syscall"

	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

// Chroot change root into new directory, set uid and gid and working directory.
// `imagePath` contain path to the image file (the compressed image file, not the output)
func (fs *defaultFS) Chroot(imagePath string) error {
	// get image path
	sandboxPath, err := imageSandboxPath(imagePath)
	if err != nil {
		return xerrors.Errorf("cannot determine image sandbox path: %w", err)
	}

	// chroot to sandboxed dir
	logrus.WithField("path", sandboxPath).Debug("chroot to sandbox directory")
	if err := syscall.Chroot(sandboxPath); err != nil {
		return xerrors.Errorf("cannot chroot to path: %w", err)
	}

	// chdir to root, this prevent chroot jailbreak attack.
	logrus.Debug("change working directory to /")
	if err := syscall.Chdir("/"); err != nil {
		return xerrors.Errorf("cannot change directory to root: %w", err)
	}

	return nil
}
