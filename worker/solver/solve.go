package solver

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/worker"
	"github.com/pkg/errors"
)

func (s *defaultSolver) Solve(ctx context.Context, spec worker.JobSpec) (*worker.JobResult, error) {
	tcgen := spec.TCGen
	compiledTcgen, err := s.compiler.Compile(ctx, tcgen)
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile testcase generator")
	}
	fmt.Println("wow", compiledTcgen)

	return nil, nil
}
