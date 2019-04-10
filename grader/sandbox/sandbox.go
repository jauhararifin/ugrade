package sandbox

import (
	"context"
	"fmt"
	"io"
	"os"
	"time"

	"github.com/jauhararifin/ugrade/grader/temporary"
)

// ErrTimeLimitExceeded indicates that contestant program running too long, exceeding maximum time limit.
var ErrTimeLimitExceeded = fmt.Errorf("program running too long")

// ErrMemoryLimitExceeded indicates that contestant program takes too much memory.
var ErrMemoryLimitExceeded = fmt.Errorf("program run out of memory")

// ErrRuntimeError indicates that contestant program not return zero exit code.
var ErrRuntimeError = fmt.Errorf("program return non zero exit code")

// ErrOutputLimitExceeded indicates that contestant program gives too much output.
var ErrOutputLimitExceeded = fmt.Errorf("program gives too output")

// Command contain information to execute.
type Command struct {
	Path string
	Args []string

	// Stdin of calling process. The child process will use stdin, stdout, and stderr from OS.
	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer

	Dir Path

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
}

// Path contain information about path in sandbox.
type Path struct {
	// Host contain absolute path to host filesystem.
	Host string

	// Sandbox contain absolute path to sandboxed filesystem.
	Sandbox string
}

// TempFile generate new temporary auto close file inside path.
func (p *Path) TempFile(pattern string) (*temporary.AutoRemoveFile, error) {
	return temporary.File(p.Host, pattern)
}

// Remove remove (delete) path from filesystem.
func (p *Path) Remove() error {
	return os.RemoveAll(p.Host)
}

// Sandbox execute command inside sandbox.
type Sandbox interface {
	PrepareDir() (*Path, error)
	Path(sandboxPath string) Path
	ExecuteCommand(ctx context.Context, cmd Command) error
}
