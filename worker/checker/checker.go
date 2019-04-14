package checker

import (
	"context"

	"github.com/jauhararifin/ugrade/sandbox/executor"
	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/compilation"
	"github.com/jauhararifin/ugrade/worker/submission"
	"github.com/jauhararifin/ugrade/worker/testcase"
)

// CheckItem contains single testcase item with checking result.
type CheckItem struct {
	InputPath     string
	OutputPath    string
	ExcpectedPath string
	Verdict       string
	Err           error
}

// CheckSuite contains testcase suite checking result.
type CheckSuite struct {
	Verdict string
	Items   []CheckItem
}

// Checker check correctness of contestant output.
type Checker interface {
	CheckSuite(
		ctx context.Context,
		spec worker.JobSpec,
		tcSuite testcase.Suite,
		submissionExec submission.ExecutionResult,
	) (*CheckSuite, error)
}

type defaultChecker struct {
	compiler compilation.Compiler
	executor executor.Executor
}

// New creates new implementation of `Checker`.
func New() Checker {
	return &defaultChecker{
		compiler: compilation.New(),
		executor: executor.New(),
	}
}
