package jobsolver

import (
	"context"

	"github.com/jauhararifin/ugrade"
)

// CheckItem contains single testcase item with checking result.
type CheckItem struct {
	InputPath     string
	OutputPath    string
	ExcpectedPath string
	Verdict       ugrade.Verdict
	Err           error
}

// CheckSuite contains testcase suite checking result.
type CheckSuite struct {
	Verdict ugrade.Verdict
	Items   []CheckItem
}

// Checker check correctness of contestant output.
type Checker interface {
	CheckSuite(
		ctx context.Context,
		spec ugrade.JobSpec,
		tcSuite TCSuite,
		submissionExec ExecutionResult,
	) (*CheckSuite, error)
}
