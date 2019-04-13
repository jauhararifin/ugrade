package compilation

import (
	"context"
	"os"
	"path/filepath"
	"time"

	"github.com/jauhararifin/ugrade/worker/executor"

	"github.com/jauhararifin/ugrade/worker"
)

// Result represent compilation result.
type Result struct {
	Duration time.Duration
	ExecPath string
}

// Remove remove compilation result.
func (r *Result) Remove() error {
	dir := filepath.Dir(r.ExecPath)
	return os.RemoveAll(dir)
}

// Compiler compile source code.
type Compiler interface {
	Compile(ctx context.Context, source worker.SourceCode) (*Result, error)
}

type defaultCompiler struct {
	executor executor.Executor
}

// New create default implementation of `Compiler`
func New() Compiler {
	return &defaultCompiler{
		executor: executor.New(),
	}
}
