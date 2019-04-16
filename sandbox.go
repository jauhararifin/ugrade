package ugrade

import (
	"context"
	"time"

	"golang.org/x/xerrors"
)

// ErrMemoryLimitExceeded indicates process inside sandbox use too much memory.
var ErrMemoryLimitExceeded = xerrors.New("memory limit exceeded")

// ErrTimeLimitExceeded indicates process inside sandbox use too much cpu or wall clock time.
var ErrTimeLimitExceeded = xerrors.New("time limit exceeded")

// ErrInternalError indicates process cannot executed inside sandbox.
var ErrInternalError = xerrors.New("internal error")

// ErrRuntimeError indicates process exited wit non zero return value.
var ErrRuntimeError = xerrors.New("runtime error")

// FSBind represent binding filesystem from host to sandbox.
type FSBind struct {
	Host    string
	Sandbox string
}

// Command contain information to execute.
type Command struct {
	// ImagePath contains path to image (compressed tar.xz file) in host filesystem.
	ImagePath string

	// Path contains path to executable file to execute in sandboxed filesystem.
	Path string

	// Args contains arguments to passed to the process.
	Args []string

	// Bind mounts host filesystem into sandboxed filesystem.
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

// Usage represent resource used by process inside sandbox.
type Usage struct {
	// Memory represent memory consumption of process.
	Memory uint64

	// CPU represent CPU time used by process.
	CPU time.Duration

	// WallTime repsent wall clock time of process in the system.
	WallTime time.Duration
}

// Sandbox execute ugsbox
type Sandbox interface {
	Execute(ctx context.Context, command Command) (Usage, error)
}
