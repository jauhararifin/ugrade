package compilation

import (
	"context"
	"io/ioutil"
	"path"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/worker/file"
	"github.com/jauhararifin/ugrade/worker/image"
	"github.com/pkg/errors"
)

func (compiler *defaultCompiler) compileCPP11(
	ctx context.Context,
	sourceFilename string,
) (*Result, error) {
	imagePath, err := image.Path("gxx-compiler")
	if err != nil {
		return nil, errors.Wrap(err, "cannot find gxx-compiler image")
	}

	runtimePath, err := image.Path("static-runtime")
	if err != nil {
		return nil, errors.Wrap(err, "cannot find static-runtime image")
	}

	workDir, err := ioutil.TempDir("", "ugrade-compilation")
	if err != nil {
		return nil, errors.Wrap(err, "cannot create temporary working directory")
	}

	if err := file.Copy(sourceFilename, path.Join(workDir, "source.cpp")); err != nil {
		return nil, errors.Wrap(err, "cannot copy source code to working directory")
	}

	cmd := sandbox.Command{
		TimeLimit:      CompileTimeLimit,
		MemoryLimit:    CompileMemoryLimit,
		MemoryThrottle: CompileMemoryThrottle,
		FileSize:       CompileFileSize,
		OpenFile:       CompileOpenFile,
		NProc:          CompileNProc,
		ImagePath:      imagePath,
		Path:           "g++",
		Stderr:         "/wd/stderr",
		Args: []string{
			"-o",
			"/wd/exec",
			"-Wall",
			"-static",
			"-std=c++11",
			"-O3",
			"/wd/source.cpp",
		},
		Binds: []sandbox.FSBind{
			sandbox.FSBind{Host: workDir,
				Sandbox: "/wd",
			},
		},
	}

	usage, err := compiler.executor.Execute(ctx, cmd)
	if err != nil {
		return nil, errors.Wrap(err, "cannot execute compiler program")
	}

	return &Result{
		Usage:        usage,
		ExecDir:      workDir,
		ExecName:     "exec",
		RuntimeImage: runtimePath,
	}, nil
}
