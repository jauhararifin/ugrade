package jobsolver

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade"
)

// TCItem represent testcase input and expected output
type TCItem struct {
	Input  string
	Output string
}

// TCSuite represent group of testcases
type TCSuite struct {
	MaxMemory uint64
	MaxCPU    time.Duration
	Tolerance float64
	Items     []TCItem
	Dir       string
}

// TCGenerator generate testcase suite
type TCGenerator interface {
	Generate(ctx context.Context, spec ugrade.JobSpec) (*TCSuite, error)
}
