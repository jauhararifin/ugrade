package sandbox

// FSBind implies binding from `Host` to `Sandbox`
type FSBind struct {
	Host    string
	Sandbox string
}

// FSUnbind unmount the mounted filesystem using bind
type FSUnbind func() error

// FS used to creating filesystem inside sandbox
type FS interface {
	Load(imagePath string, uid, gid int) error
	Chroot(imagePath string) error
	Bind(imagePath string, bind FSBind, uid, gid int) (FSUnbind, error)
}
