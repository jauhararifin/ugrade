package compilation

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/executor"
	"github.com/jauhararifin/ugrade/worker"
)

// CompileTimeLimit limit cpu usage of compilation process
const CompileTimeLimit = 10 * time.Second

// CompileMemoryLimit limit memory usage of compilation process
const CompileMemoryLimit = 256 * 1024 * 1024

// CompileMemoryThrottle throttle memory when compiling
const CompileMemoryThrottle = 320 * 1024 * 1024

// CompileFileSize limit maximum generated file when compiling
const CompileFileSize = 128 * 1024 * 1024

// CompileOpenFile limit open file when compiling
const CompileOpenFile = 64

// CompileNProc limit process when compiling
const CompileNProc = 64

// Result represent compilation result.
type Result struct {
	Usage        sandbox.Usage
	ExecDir      string
	ExecName     string
	RuntimeImage string
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
