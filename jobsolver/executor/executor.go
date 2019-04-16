package executor

import (
	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/jobsolver/compiler"
	"github.com/jauhararifin/ugrade/sandbox"
)

type defaultExecutor struct {
	compiler compiler.Compiler
	sandbox  ugrade.Sandbox
}

// New create default implementation of `job.Executor`
func New() jobsolver.Executor {
	return &defaultExecutor{
		compiler: compiler.New(),
		sandbox:  sandbox.New(),
	}
}
