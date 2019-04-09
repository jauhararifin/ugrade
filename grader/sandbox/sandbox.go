package sandbox

import (
	"context"
	"io"
	"os"

	"github.com/jauhararifin/ugrade/grader/temporary"
)

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
