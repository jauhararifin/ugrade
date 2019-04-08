package main

import (
	"context"
	"io"
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

// Sandbox execute command inside sandbox.
type Sandbox interface {
	PrepareDir() (*Path, error)
	Path(sandboxPath string) Path
	ExecuteCommand(ctx context.Context, cmd Command) error
}
