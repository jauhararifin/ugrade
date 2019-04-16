package solver

import (
	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/jobsolver/checker"
	"github.com/jauhararifin/ugrade/jobsolver/compiler"
	"github.com/jauhararifin/ugrade/jobsolver/executor"
	"github.com/jauhararifin/ugrade/jobsolver/tcgenerator"
)

type defaultSolver struct {
	compiler           jobsolver.Compiler
	tcgenerator        jobsolver.TCGenerator
	submissionExecutor jobsolver.Executor
	checker            jobsolver.Checker
}

// New creates default implementation of `ugrade.Solver`.
func New() (ugrade.JobSolver, error) {
	return &defaultSolver{
		compiler:           compiler.New(),
		tcgenerator:        tcgenerator.NewGenerator(),
		submissionExecutor: executor.New(),
		checker:            checker.New(),
	}, nil
}
