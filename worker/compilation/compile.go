package compilation

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/worker"
)

// Compile compiles source code.
func (comp *defaultCompiler) Compile(ctx context.Context, source worker.SourceCode) (*Result, error) {
	if source.Language == "1" {
		return comp.compileC(ctx, source.Path)
	} else if source.Language == "2" {
		return comp.compileCPP11(ctx, source.Path)
	}
	return nil, fmt.Errorf("unrecognized language id: %s", source.Language)
}
