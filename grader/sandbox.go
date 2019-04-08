package grader

import (
	"context"
	"io"
)

// Command contain information to execute.
type Command struct {
	Path string
	Args []string

	// standar input, output, error
	Stdin  io.Reader
	Stdout io.Writer
	Stderr io.Writer

	// absolute working dir path inside sandbox
	Dir string
}

// Sandbox execute command inside sandbox.
type Sandbox interface {
	PrepareDir() (hostDir string, sandboxDir string, err error)
	ExecuteCommand(ctx context.Context, cmd Command) error
	ExecuteChild(ctx context.Context, cmd Command) error
}
