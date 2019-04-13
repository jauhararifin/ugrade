package solver

import (
	"github.com/jauhararifin/ugrade/worker"
)

type defaultSolver struct{}

// New creates default implementation of `worker.Solver`.
func New() (worker.Solver, error) {
	return &defaultSolver{}, nil
}
