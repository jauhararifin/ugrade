package compilation

import (
	"context"
	"io/ioutil"
	"path"
	"time"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker/file"
	"github.com/jauhararifin/ugrade/worker/image"
	"github.com/pkg/errors"
)

func (compiler *defaultCompiler) compileC(
	ctx context.Context,
	sourceFilename string,
) (*Result, error) {
	imagePath, err := image.Path("gxx-compiler")
	if err != nil {
		return nil, errors.Wrap(err, "cannot find gxx-compiler image")
	}

	workDir, err := ioutil.TempDir("", "ugrade-compilation")
	if err != nil {
		return nil, errors.Wrap(err, "cannot create temporary working directory")
	}

	if err := file.Copy(sourceFilename, path.Join(workDir, "source.c")); err != nil {
		return nil, errors.Wrap(err, "cannot copy source code to working directory")
	}

	cmd := sandbox.Command{
		TimeLimit:      10 * time.Second,  // limit 10 seconds for compiling
		MemoryLimit:    256 * 1024 * 1024, // limit 256MB for compiling
		MemoryThrottle: 320 * 1024 * 1024, // throttle compiler into 320MB
		Stderr:         path.Join(workDir, "stderr"),
		FileSize:       128 * 1024 * 1024, // maximum 128MB generated file
		OpenFile:       64,                // maximum 64 open files
		NProc:          64,                // maximum 64 forks
		ImagePath:      imagePath,
		Path:           "gcc",
		Args: []string{
			"-o",
			"/wd/exec",
			"-Wall",
			"-std=gnu11",
			"-static",
			"-O2",
			"/wd/source.c",
		},
		Binds: []sandbox.FSBind{
			sandbox.FSBind{Host: workDir,
				Sandbox: "/wd",
			},
		},
	}

	startTime := time.Now()
	if err := compiler.executor.Execute(ctx, cmd); err != nil {
		return nil, errors.Wrap(err, "cannot execute compiler program")
	}
	duration := time.Since(startTime)

	return &Result{
		Duration: duration,
		ExecPath: path.Join(workDir, "exec"),
	}, nil
}
