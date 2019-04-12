package sandbox

// FS used to creating filesystem inside sandbox
type FS interface {
	Load(imagePath string, uid, gid int) (*Path, error)
	Chroot(imagePath string) error
}
