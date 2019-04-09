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
	Path   string
	Args   []string
	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer

	TimeLimit   uint32
	MemoryLimit uint32

	Dir Path
}

// Path contain information about path in sandbox.
type Path struct {
	Host    string
	Sandbox string
}

// TempFile generate new temporary auto close file inside path.
func (p Path) TempFile(pattern string) (*temporary.AutoCloseTempFile, error) {
	return temporary.File(p.Host, pattern)
}

// Remove remove path from filesystem.
func (p *Path) Remove() error {
	return os.RemoveAll(p.Host)
}

// Sandbox execute command inside sandbox.
type Sandbox interface {
	PrepareDir() (*Path, error)
	Path(sandboxPath string) Path
	ExecuteCommand(ctx context.Context, cmd Command) error
	ExecuteChild(ctx context.Context, cmd Command) error
}
