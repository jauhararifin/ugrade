package solver

import (
	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/compilation"
	"github.com/jauhararifin/ugrade/worker/submission"
	"github.com/jauhararifin/ugrade/worker/testcase"
)

type defaultSolver struct {
	compiler           compilation.Compiler
	tcgenerator        testcase.Generator
	submissionExecutor submission.Executor
}

// New creates default implementation of `worker.Solver`.
func New() (worker.Solver, error) {
	return &defaultSolver{
		compiler:           compilation.New(),
		tcgenerator:        testcase.NewGenerator(),
		submissionExecutor: submission.New(),
	}, nil
}
