package compilation

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade/worker/executor"

	"github.com/jauhararifin/ugrade/worker"
)

// Result represent compilation result.
type Result struct {
	Duration time.Duration
	ExecPath string
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
	return &defaultCompiler{}
}
