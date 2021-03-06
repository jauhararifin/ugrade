package ugrade

import (
	"context"
	"time"

	"golang.org/x/xerrors"
)

// ErrCompilationError indicates program source code cannot compiled.
var ErrCompilationError = xerrors.New("compile error")

// Verdict represent verdict of submission.
type Verdict string

const (
	// VerdictCE stands for Compilation Error.
	VerdictCE = Verdict("CE")

	// VerdictIE stands for Internal Error.
	VerdictIE = Verdict("IE")

	// VerdictRTE stands for Run Time Error.
	VerdictRTE = Verdict("RTE")

	// VerdictMLE stands for Memory Limit Exceeded.
	VerdictMLE = Verdict("MLE")

	// VerdictTLE stands for Time Limit Exceeded.
	VerdictTLE = Verdict("TLE")

	// VerdictWA stands for Wrong Answer.
	VerdictWA = Verdict("WA")

	// VerdictPENDING indicating that job is not graded yet.
	VerdictPENDING = Verdict("PENDING")

	// VerdictAC stands for Accepted.
	VerdictAC = Verdict("AC")
)

// SourceCode represent program's source code.
type SourceCode struct {
	// Path contains absolute path to source code file.
	Path string

	// Language contains language id of source code program.
	Language string
}

// JobSpec represent job specification from ugrade server.
type JobSpec struct {
	// TCGen represent testcase generator used for generating testcase input files.
	TCGen SourceCode

	// Solution represent jury solution.
	Solution SourceCode

	// Checker represent checker program to check correctness of contestant submissions by
	// comparing to jury outputs.
	Checker SourceCode

	// Submission represent contestant program solution.
	Submission SourceCode

	// TimeLimit represent maximum time allowed for solution to be executed.
	TimeLimit time.Duration

	// OutputLimit represent maximum output generated by programs.
	OutputLimit uint64

	// MemoryLimit represent maximum allowed memory used by program.
	MemoryLimit uint64

	// Tolerance represent tolerance factor of problem.
	Tolerance float64
}

// JobResult represent job result generated by worker.
type JobResult struct {
	Verdict Verdict
}

// JobSolver solve job and gives result.
type JobSolver interface {
	Solve(ctx context.Context, spec JobSpec) (*JobResult, error)
}
