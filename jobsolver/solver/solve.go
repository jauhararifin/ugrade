package solver

import (
	"context"

	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (s *defaultSolver) Solve(ctx context.Context, spec ugrade.JobSpec) (*ugrade.JobResult, error) {
	// generate testcase suite.
	tcsuite, err := s.tcgenerator.Generate(ctx, spec)
	if err != nil {
		return nil, xerrors.Errorf("cannot generate testcase suite: %w", err)
	}

	// execute contestant solution based on the testcases.
	execRes, err := s.submissionExecutor.Execute(ctx, spec, *tcsuite)
	if err != nil {
		if xerrors.Is(err, ugrade.ErrCompilationError) {
			return &ugrade.JobResult{
				Verdict: ugrade.VerdictCE,
			}, nil
		}
		return nil, xerrors.Errorf("cannot execute contestant solution: %w", err)
	}

	// check contestant output correctness.
	checkSuite, err := s.checker.CheckSuite(ctx, spec, *tcsuite, *execRes)
	if err != nil {
		return nil, xerrors.Errorf("cannot check contestant outputs: %w", err)
	}

	return &ugrade.JobResult{
		Verdict: checkSuite.Verdict,
	}, nil
}
