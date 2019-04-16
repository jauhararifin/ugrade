package fs

import (
	"os"
	"path"
	"syscall"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/sandbox"
	"golang.org/x/xerrors"
)

func (fs *defaultFS) Bind(imagePath string, bind ugrade.FSBind, uid, gid int) (sandbox.FSUnbind, error) {
	// get extracted image path
	imgRealPath, err := imageSandboxPath(imagePath)
	if err != nil {
		return nil, xerrors.Errorf("cannot get image extracted path: %w", err)
	}

	// ensure target directory exists
	targetPath := path.Join(imgRealPath, bind.Sandbox)
	info, err := os.Stat(targetPath)
	if err != nil && !os.IsNotExist(err) {
		return nil, xerrors.Errorf("cannot stat sandbox directory: %w", err)
	}
	if os.IsNotExist(err) {
		if err := os.MkdirAll(targetPath, 744); err != nil {
			return nil, xerrors.Errorf("cannot create mount directory: %w", err)
		}
		info, err = os.Stat(targetPath)
	}
	if err != nil {
		return nil, xerrors.Errorf("cannot check mount directory existence: %w", err)
	}
	if !info.IsDir() {
		return nil, xerrors.New("mount target already exists but not a directory")
	}

	// maybe, unmount it first? in case already mounted. Just ignore the error right?
	syscall.Unmount(targetPath, 0)

	// mount it
	if err := syscall.Mount(bind.Host, targetPath, "", syscall.MS_BIND, ""); err != nil {
		return nil, xerrors.Errorf("cannot call mount syscall: %w", err)
	}

	// change mounted dir owner
	if err := fs.chownDir(targetPath, uid, gid); err != nil {
		return nil, xerrors.Errorf("cannot change owner of mounted directory: %w", err)
	}

	return func() error {
		if err := syscall.Unmount(targetPath, 0); err != nil {
			return xerrors.Errorf("cannot call unmount syscall: %w", err)
		}
		os.RemoveAll(targetPath)
		return nil
	}, nil
}
