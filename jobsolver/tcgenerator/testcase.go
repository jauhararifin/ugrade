package tcgenerator

import (
	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/jobsolver/compiler"
	"github.com/jauhararifin/ugrade/sandbox"
)

// TCGenOpenFile limit open file when compiling
const TCGenOpenFile = 64

// TCGenNProc limit process when compiling
const TCGenNProc = 64

type defaultGenerator struct {
	sandbox  ugrade.Sandbox
	compiler jobsolver.Compiler
}

// NewGenerator create default implementation of `jobsolver.TCGenerator`
func NewGenerator() jobsolver.TCGenerator {
	return &defaultGenerator{
		sandbox:  sandbox.New(),
		compiler: compiler.New(),
	}
}
