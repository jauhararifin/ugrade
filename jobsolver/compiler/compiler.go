package compiler

import (
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/sandbox"
)

// CompileTimeLimit limit cpu usage of compilation process
const CompileTimeLimit = 10 * time.Second

// CompileMemoryLimit limit memory usage of compilation process
const CompileMemoryLimit = 256 * 1024 * 1024

// CompileMemoryThrottle throttle memory when compiling
const CompileMemoryThrottle = 320 * 1024 * 1024

// CompileFileSize limit maximum generated file when compiling
const CompileFileSize = 128 * 1024 * 1024

// CompileOpenFile limit open file when compiling
const CompileOpenFile = 64

// CompileNProc limit process when compiling
const CompileNProc = 64

type defaultCompiler struct {
	sandbox ugrade.Sandbox
}

// New create default implementation of `jobsolver.Compiler`.
func New() jobsolver.Compiler {
	return &defaultCompiler{
		sandbox: sandbox.New(),
	}
}
