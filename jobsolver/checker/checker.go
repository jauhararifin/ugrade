package checker

import (
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/jobsolver/compiler"
	"github.com/jauhararifin/ugrade/sandbox/executor"
)

type defaultChecker struct {
	compiler jobsolver.Compiler
	executor jobsolver.Executor
}

// New creates new implementation of `Checker`.
func New() Checker {
	return &defaultChecker{
		compiler: compiler.New(),
		executor: executor.New(),
	}
}
