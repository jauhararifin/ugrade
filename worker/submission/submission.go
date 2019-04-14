package submission

import (
	"context"

	"github.com/jauhararifin/ugrade/sandbox/executor"

	"github.com/jauhararifin/ugrade/worker/compilation"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker"

	"github.com/jauhararifin/ugrade/worker/testcase"
)

// ExecutionItem represent single execution of contestant submission.
type ExecutionItem struct {
	InputName  string
	OutputName string
	Usage      sandbox.Usage
	Err        error
}

// ExecutionResult represent execution of contestant submission given testcase suite.
type ExecutionResult struct {
	Dir   string
	Items []ExecutionItem
}

// Executor execute submission given testcase suite.
type Executor interface {
	Execute(ctx context.Context, spec worker.JobSpec, tcSuite testcase.Suite) (*ExecutionResult, error)
}

type defaultExecutor struct {
	compiler compilation.Compiler
	executor executor.Executor
}

// New create default implementation of `Executor`
func New() Executor {
	return &defaultExecutor{
		compiler: compilation.New(),
		executor: executor.New(),
	}
}
