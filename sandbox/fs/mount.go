package fs

import (
	"os"
	"path"
	"syscall"

	"github.com/jauhararifin/ugrade/sandbox"

	"github.com/pkg/errors"
)

func (fs *defaultFS) Bind(imagePath string, bind sandbox.FSBind, uid, gid int) (sandbox.FSUnbind, error) {
	// get extracted image path
	imgRealPath, err := imageSandboxPath(imagePath)
	if err != nil {
		return nil, errors.Wrap(err, "cannot get image extracted path")
	}

	// ensure target directory exists
	targetPath := path.Join(imgRealPath, bind.Sandbox)
	info, err := os.Stat(targetPath)
	if os.IsNotExist(err) {
		if err := os.MkdirAll(targetPath, 744); err != nil {
			return nil, errors.Wrap(err, "cannot create mount directory")
		}
		info, err = os.Stat(targetPath)
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot check mount directory existence")
	}
	if !info.IsDir() {
		return nil, errors.New("mount target already exists but not a directory")
	}

	// mount it
	if err := syscall.Mount(bind.Host, targetPath, "", syscall.MS_BIND, ""); err != nil {
		return nil, errors.Wrap(err, "cannot call mount syscall")
	}

	// change mounted dir owner
	if err := fs.chownDir(targetPath, uid, gid); err != nil {
		return nil, errors.Wrap(err, "cannot change owner of mounted directory")
	}

	return func() error {
		if err := syscall.Unmount(targetPath, 0); err != nil {
			return errors.Wrap(err, "cannot call unmount syscall")
		}
		os.RemoveAll(targetPath)
		return nil
	}, nil
}
