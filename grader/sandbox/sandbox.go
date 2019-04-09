package sandbox

import (
	"context"
	"fmt"
	"io"
	"os"

	"github.com/jauhararifin/ugrade/grader/temporary"
)

// ErrTimeLimitExceeded indicates that contestant program running too long, exceeding maximum time limit.
var ErrTimeLimitExceeded = fmt.Errorf("contestant program running too long")

// ErrMemoryLimitExceeded indicates that contestant program takes too much memory.
var ErrMemoryLimitExceeded = fmt.Errorf("contestant program run out of memory")

// ErrRuntimeError indicates that contestant program not return zero exit code.
var ErrRuntimeError = fmt.Errorf("contestant program return non zero exit code")

// Command contain information to execute.
type Command struct {
	Path string
	Args []string

	// Stdin of calling process. The child process will use stdin, stdout, and stderr from OS.
	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer

	Dir Path

	// TimeLimit indicates maximum allowed cpu + io time in milisecond of program to use.
	// Program will killed when running longer than this limit.
	TimeLimit uint64

	// MemoryLimit indicates maximum allowed memory in bytes allocation to be used by program.
	// Program will killed when allocating memory more than this limit.
	MemoryLimit uint64

	// MemoryThrottle will cause program to use no more than this value, but not killed when using more than this.
	// When memory allocation is too high, the program will be throttled.
	MemoryThrottle uint64
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
