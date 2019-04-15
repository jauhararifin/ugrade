package sandbox

import (
	"time"
)

// Command contain information to execute.
type Command struct {
	ImagePath string

	Path string
	Args []string

	// Bind mounts
	Binds []FSBind

	// Path to file to be used as stdin for sandboxed process.
	// If empty, stdin will derived from parent standard input.
	Stdin  string
	Stdout string
	Stderr string

	// Working directory of process inside sandbox.
	Dir string

	// TimeLimit indicates maximum allowed cpu time of process to use.
	// Proces will killed when running longer than this limit.
	TimeLimit time.Duration

	// WallTimeLimit indicates maximum allowed time of process including CPU and IO.
	WallTimeLimit time.Duration

	// MemoryLimit indicates maximum allowed memory in bytes allocation to be used by process.
	// Process will killed when allocating memory more than this limit.
	MemoryLimit uint64

	// MemoryThrottle will cause process to use no more than this value, but not killed when using more than this.
	// When memory allocation is too high, the process will be throttled.
	MemoryThrottle uint64

	// FileSize will cause process to exit when trying to generate file with size exceeding this value.
	FileSize uint64

	// OpenFile limit number of open file of process.
	OpenFile uint64

	// NProc limit number of process that process can create.
	NProc uint64

	// Limit stack size of process.
	StackSize uint64
}
