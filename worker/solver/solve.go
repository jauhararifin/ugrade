package solver

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/worker"
	"github.com/pkg/errors"
)

func (s *defaultSolver) Solve(ctx context.Context, spec worker.JobSpec) (*worker.JobResult, error) {
	tcsuite, err := s.tcgenerator.Generate(ctx, spec)
	if err != nil {
		return nil, errors.Wrap(err, "cannot generate testcase suite")
	}

	fmt.Println(*tcsuite)

	execRes, err := s.submissionExecutor.Execute(ctx, spec, *tcsuite)
	if err != nil {
		return nil, errors.Wrap(err, "cannot execute contestant solution")
	}

	fmt.Println(*execRes)

	return nil, nil
}
