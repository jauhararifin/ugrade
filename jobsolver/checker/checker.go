package checker

import (
	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/jobsolver/compiler"
	"github.com/jauhararifin/ugrade/sandbox"
)

type defaultChecker struct {
	compiler jobsolver.Compiler
	sandbox  ugrade.Sandbox
}

// New creates new implementation of `Checker`.
func New() jobsolver.Checker {
	return &defaultChecker{
		compiler: compiler.New(),
		sandbox:  sandbox.New(),
	}
}
