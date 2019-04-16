package jobsolver

import "github.com/jauhararifin/ugrade/jobsolver/solver"

// New creates default implementation of `ugrade.Solver`.
func New() (ugrade.Solver, error) {
	return solver.New()
}
