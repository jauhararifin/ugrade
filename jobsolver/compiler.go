package jobsolver

import (
	"context"

	"github.com/jauhararifin/ugrade"
)

// CompilationResult represent compilation result.
type CompilationResult struct {
	// Usage contains information about memory and cpu usage when compiling.
	Usage ugrade.Usage

	// ExecDir contains path to generated executable directory. This path is relative to host filesystem
	ExecDir string

	// ExecName contains executable file name generated by compiler. Thus, the path to executable file
	// is `ExecDir`/`ExecName`
	ExecName string

	// RuntimeImage contains path to compressed sandbox image file that can be used to run the executable
	RuntimeImage string
}

// Compiler compile source code and provide `CompilationResult`.
type Compiler interface {
	Compile(ctx context.Context, source ugrade.SourceCode) (*CompilationResult, error)
}
