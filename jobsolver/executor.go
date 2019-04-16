package jobsolver

import (
	"context"

	"github.com/jauhararifin/ugrade"
)

// ExecutionItem represent single execution of contestant submission.
type ExecutionItem struct {
	InputName  string
	OutputName string
	Usage      ugrade.Usage
	Err        error
}

// ExecutionResult represent execution of contestant submission given testcase suite.
type ExecutionResult struct {
	Dir   string
	Items []ExecutionItem
}

// Executor execute submission given testcase suite.
type Executor interface {
	Execute(ctx context.Context, spec ugrade.JobSpec, tcSuite TCSuite) (*ExecutionResult, error)
}
