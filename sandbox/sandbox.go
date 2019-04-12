package sandbox

import (
	"io"
	"time"
)

// Command contain information to execute.
type Command struct {
	ImagePath string

	Path string
	Args []string

	// Stdin of calling process. The child process will use stdin, stdout, and stderr from OS.
	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer

	Dir string

	// TimeLimit indicates maximum allowed cpu time of process to use.
	// Proces will killed when running longer than this limit.
	TimeLimit time.Duration

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

// Path contain information about path in sandbox.
type Path struct {
	// Host contain absolute path to host filesystem.
	Host string

	// Sandbox contain absolute path to sandboxed filesystem.
	Sandbox string
}
