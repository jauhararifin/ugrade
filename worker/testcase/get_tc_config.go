package testcase

import (
	"context"
	"fmt"
	"io/ioutil"
	"path"
	"time"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/compilation"
	"github.com/pkg/errors"
)

func (gen *defaultGenerator) getTCSampleCount(
	ctx context.Context,
	tcgen compilation.Result,
	spec worker.JobSpec,
) (int, error) {
	cmd := sandbox.Command{
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
		Binds: []sandbox.FSBind{
			sandbox.FSBind{
				Host:    tcgen.ExecDir,
				Sandbox: "/wd",
			},
		},
	}

	if _, err := gen.executor.Execute(ctx, cmd); err != nil {
		return 0, errors.Wrap(err, "cannot get sample count")
	}

	bytes, err := ioutil.ReadFile(path.Join(tcgen.ExecDir, "sample_count"))
	if err != nil {
		return 0, errors.Wrap(err, "cannot read sample count result")
	}

	var nSample int
	fmt.Sscanf(string(bytes), "%d", &nSample)
	return nSample, nil
}

func (gen *defaultGenerator) getTCCount(
	ctx context.Context,
	tcgen compilation.Result,
	spec worker.JobSpec,
) (int, error) {
	cmd := sandbox.Command{
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
		Binds: []sandbox.FSBind{
			sandbox.FSBind{
				Host:    tcgen.ExecDir,
				Sandbox: "/wd",
			},
		},
	}

	if _, err := gen.executor.Execute(ctx, cmd); err != nil {
		return 0, errors.Wrap(err, "cannot get testcase count")
	}

	bytes, err := ioutil.ReadFile(path.Join(tcgen.ExecDir, "testcase_count"))
	if err != nil {
		return 0, errors.Wrap(err, "cannot read tesstcase count result")
	}

	var nTC int
	fmt.Sscanf(string(bytes), "%d", &nTC)
	return nTC, nil
}
