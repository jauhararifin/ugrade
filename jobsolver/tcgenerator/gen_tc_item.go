package tcgenerator

import (
	"context"
	"fmt"
	"path"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/sandbox"
	"golang.org/x/xerrors"
)

func (gen *defaultGenerator) generateItem(
	ctx context.Context,
	dir string,
	tcgen jobsolver.CompilationResult,
	solution jobsolver.CompilationResult,
	spec ugrade.JobSpec,
	id int,
	sample bool,
) (*Item, *ugrade.Usage, error) {
	// determine type and id
	typ := "testcase"
	if sample {
		typ = "sample"
	}
	idstr := fmt.Sprintf("%d", id)

	// prepare command for generate input file
	tcinFName := fmt.Sprintf("tc-%s-%d.in", typ, id)
	cmd := ugrade.Command{
		TimeLimit:      spec.TimeLimit,
		MemoryLimit:    spec.MemoryLimit,
		MemoryThrottle: spec.MemoryLimit + 16*1024*1024,
		FileSize:       spec.OutputLimit,
		OpenFile:       TCGenOpenFile,
		NProc:          TCGenNProc,
		ImagePath:      tcgen.RuntimeImage,
		Path:           path.Join("/program", tcgen.ExecName),
		Stdout:         path.Join("/testcases", tcinFName),
		Args:           []string{typ, idstr},
		Binds: []ugrade.FSBind{
			ugrade.FSBind{
				Host:    tcgen.ExecDir,
				Sandbox: "/program",
			},
			ugrade.FSBind{
				Host:    dir,
				Sandbox: "/testcases",
			},
		},
	}

	if _, err := gen.executor.Execute(ctx, cmd); err != nil {
		return nil, nil, xerrors.Errorf("cannot generate %s input with id: %s: %w", typ, idstr, err)
	}

	tcoutFName := fmt.Sprintf("tc-%s-%d.out", typ, id)
	cmd = ugrade.Command{
		TimeLimit:      spec.TimeLimit,
		MemoryLimit:    spec.MemoryLimit,
		MemoryThrottle: spec.MemoryLimit + 16*1024*1024,
		FileSize:       spec.OutputLimit,
		OpenFile:       TCGenOpenFile,
		NProc:          TCGenNProc,
		ImagePath:      solution.RuntimeImage,
		Path:           path.Join("/program", solution.ExecName),
		Stdin:          path.Join("/testcases", tcinFName),
		Stdout:         path.Join("/testcases", tcoutFName),
		Binds: []sandbox.FSBind{
			sandbox.FSBind{
				Host:    solution.ExecDir,
				Sandbox: "/program",
			},
			sandbox.FSBind{
				Host:    dir,
				Sandbox: "/testcases",
			},
		},
	}

	usage, err := gen.sandbox.Execute(ctx, cmd)
	if err != nil {
		return nil, nil, xerrors.Errorf("cannot generate %s input with id: %s: %w", typ, idstr, err)
	}

	return &Item{
		Input:  tcinFName,
		Output: tcoutFName,
	}, &usage, nil
}
