package testcase

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade/worker/compilation"

	"github.com/jauhararifin/ugrade/worker"

	"github.com/jauhararifin/ugrade/sandbox/executor"
)

// TCGenOpenFile limit open file when compiling
const TCGenOpenFile = 64

// TCGenNProc limit process when compiling
const TCGenNProc = 64

// Item represent testcase input and expected output
type Item struct {
	Input  string
	Output string
}

// Suite represent group of testcases
type Suite struct {
	MaxMemory uint64
	MaxCPU    time.Duration
	Tolerance float64
	Items     []Item
	Dir       string
}

// Generator generate testcase suite
type Generator interface {
	Generate(ctx context.Context, spec worker.JobSpec) (*Suite, error)
}

type defaultGenerator struct {
	executor executor.Executor
	compiler compilation.Compiler
}

// NewGenerator create default implementation of `Generator`
func NewGenerator() Generator {
	return &defaultGenerator{
		executor: executor.New(),
		compiler: compilation.New(),
	}
}
