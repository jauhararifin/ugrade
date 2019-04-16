package tcgenerator

import (
	"context"
	"fmt"
	"io/ioutil"
	"path"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"golang.org/x/xerrors"
)

func (gen *defaultGenerator) getTCSampleCount(
	ctx context.Context,
	tcgen jobsolver.CompilationResult,
	spec ugrade.JobSpec,
) (int, error) {
	cmd := ugrade.Command{
		TimeLimit:      spec.TimeLimit,
		WallTimeLimit:  spec.TimeLimit + 2*time.Second,
		MemoryLimit:    spec.MemoryLimit,
		MemoryThrottle: spec.MemoryLimit + 16*1024*1024,
		FileSize:       spec.OutputLimit,
		OpenFile:       TCGenOpenFile,
		NProc:          TCGenNProc,
		ImagePath:      tcgen.RuntimeImage,
		Path:           path.Join("/wd", tcgen.ExecName),
		Stdout:         path.Join("/wd", "sample_count"),
		Args:           []string{"sample_count"},
		Binds: []ugrade.FSBind{
			ugrade.FSBind{
				Host:    tcgen.ExecDir,
				Sandbox: "/wd",
			},
		},
	}

	if _, err := gen.sandbox.Execute(ctx, cmd); err != nil {
		return 0, xerrors.Errorf("cannot get sample count: %w", err)
	}

	bytes, err := ioutil.ReadFile(path.Join(tcgen.ExecDir, "sample_count"))
	if err != nil {
		return 0, xerrors.Errorf("cannot read sample count result: %w", err)
	}

	var nSample int
	fmt.Sscanf(string(bytes), "%d", &nSample)
	return nSample, nil
}

func (gen *defaultGenerator) getTCCount(
	ctx context.Context,
	tcgen jobsolver.CompilationResult,
	spec ugrade.JobSpec,
) (int, error) {
	cmd := ugrade.Command{
		TimeLimit:      spec.TimeLimit,
		WallTimeLimit:  spec.TimeLimit + 2*time.Second,
		MemoryLimit:    spec.MemoryLimit,
		MemoryThrottle: spec.MemoryLimit + 16*1024*1024,
		FileSize:       spec.OutputLimit,
		OpenFile:       TCGenOpenFile,
		NProc:          TCGenNProc,
		ImagePath:      tcgen.RuntimeImage,
		Path:           path.Join("/wd", tcgen.ExecName),
		Stdout:         path.Join("/wd", "testcase_count"),
		Args:           []string{"testcase_count"},
		Binds: []ugrade.FSBind{
			ugrade.FSBind{
				Host:    tcgen.ExecDir,
				Sandbox: "/wd",
			},
		},
	}

	if _, err := gen.sandbox.Execute(ctx, cmd); err != nil {
		return 0, xerrors.Errorf("cannot get testcase count: %w", err)
	}

	bytes, err := ioutil.ReadFile(path.Join(tcgen.ExecDir, "testcase_count"))
	if err != nil {
		return 0, xerrors.Errorf("cannot read tesstcase count result: %w", err)
	}

	var nTC int
	fmt.Sscanf(string(bytes), "%d", &nTC)
	return nTC, nil
}
