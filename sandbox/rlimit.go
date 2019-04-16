package sandbox

// RLimit limit current process resource using linux rlimit.
type RLimit interface {
	LimitOpenFile(nopenfile uint64) error
	LimitFSize(fsize uint64) error
	LimitNProcess(nproc uint64) error
	LimitStack(stackSize uint64) error
}
