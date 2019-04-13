package testcase

import (
	"context"
	"fmt"
	"path"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/compilation"

	"github.com/pkg/errors"
)

func (gen *defaultGenerator) generateItem(
	ctx context.Context,
	dir string,
	tcgen compilation.Result,
	solution compilation.Result,
	spec worker.JobSpec,
	id int,
	sample bool,
) (*Item, *sandbox.Usage, error) {
	// determine type and id
	typ := "testcase"
	if sample {
		typ = "sample"
	}
	idstr := fmt.Sprintf("%d", id)

	// prepare command for generate input file
	tcinFName := fmt.Sprintf("tc-%s-%d.in", typ, id)
	cmd := sandbox.Command{
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
		Binds: []sandbox.FSBind{
			sandbox.FSBind{
				Host:    tcgen.ExecDir,
				Sandbox: "/program",
			},
			sandbox.FSBind{
				Host:    dir,
				Sandbox: "/testcases",
			},
		},
	}

	if _, err := gen.executor.Execute(ctx, cmd); err != nil {
		return nil, nil, errors.Wrapf(err, "cannot generate %s input with id: %s", typ, idstr)
	}

	tcoutFName := fmt.Sprintf("tc-%s-%d.out", typ, id)
	cmd = sandbox.Command{
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

	usage, err := gen.executor.Execute(ctx, cmd)
	if err != nil {
		return nil, nil, errors.Wrapf(err, "cannot generate %s input with id: %s", typ, idstr)
	}

	return &Item{
		Input:  tcinFName,
		Output: tcoutFName,
	}, &usage, nil
}
