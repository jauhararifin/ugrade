package solver

import (
	"context"

	"github.com/jauhararifin/ugrade/worker"
	"github.com/pkg/errors"
)

func (s *defaultSolver) Solve(ctx context.Context, spec worker.JobSpec) (*worker.JobResult, error) {
	tcsuite, err := s.tcgenerator.Generate(ctx, spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot generate testcase suite")
	}

	execRes, err := s.submissionExecutor.Execute(ctx, spec, *tcsuite)
	if err != nil {
		if _, ok := errors.Cause(err).(worker.CompilationError); ok {
			return &worker.JobResult{
				Verdict: worker.CE,
			}, nil
		}
		return nil, errors.Wrap(err, "cannot execute contestant solution")
	}

	checkSuite, err := s.checker.CheckSuite(ctx, spec, *tcsuite, *execRes)
	if err != nil {
		return nil, errors.Wrap(err, "cannot check contestant outputs")
	}

	return &worker.JobResult{
		Verdict: checkSuite.Verdict,
	}, nil
}
