package sandbox

import "github.com/jauhararifin/ugrade"

// FSUnbind unmount the mounted filesystem using bind
type FSUnbind func() error

// FS used to creating filesystem inside sandbox
type FS interface {
	Load(imagePath string, uid, gid int) error
	Chroot(imagePath string) error
	Bind(imagePath string, bind ugrade.FSBind, uid, gid int) (FSUnbind, error)
}
