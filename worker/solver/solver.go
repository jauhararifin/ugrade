package solver

import (
	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/compilation"
)

type defaultSolver struct {
	compiler compilation.Compiler
}

// New creates default implementation of `worker.Solver`.
func New() (worker.Solver, error) {
	return &defaultSolver{
		compiler: compilation.New(),
	}, nil
}
