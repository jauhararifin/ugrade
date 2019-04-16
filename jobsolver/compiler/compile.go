package compiler

import (
	"context"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"golang.org/x/xerrors"
)

// Compile compiles source code.
func (comp *defaultCompiler) Compile(ctx context.Context, source ugrade.SourceCode) (*jobsolver.CompilationResult, error) {
	if source.Language == "1" {
		return comp.compileC(ctx, source.Path)
	} else if source.Language == "2" {
		return comp.compileCPP11(ctx, source.Path)
	}
	return nil, xerrors.Errorf("unrecognized language id: %s", source.Language)
}
