package compiler

import (
	"context"
	"io/ioutil"
	"path"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/jobsolver/file"
	"github.com/jauhararifin/ugrade/jobsolver/image"
	"golang.org/x/xerrors"
)

func (compiler *defaultCompiler) compileC(
	ctx context.Context,
	sourceFilename string,
) (*jobsolver.CompilationResult, error) {
	// search gxx-compiler image path
	imagePath, err := image.Path("gxx-compiler")
	if err != nil {
		return nil, xerrors.Errorf("cannot find gxx-compiler image: %w", err)
	}

	// search static-runtime image path
	runtimePath, err := image.Path("static-runtime")
	if err != nil {
		return nil, xerrors.Errorf("cannot find static-runtime image: %w", err)
	}

	// create temporary directory for storing compilation result
	workDir, err := ioutil.TempDir("", "ugrade-compilation")
	if err != nil {
		return nil, xerrors.Errorf("cannot create temporary working directory: %w", err)
	}

	// copy source code to compilation result.
	if err := file.Copy(sourceFilename, path.Join(workDir, "source.c")); err != nil {
		return nil, xerrors.Errorf("cannot copy source code to working directory: %w", err)
	}

	cmd := ugrade.Command{
		TimeLimit:      CompileTimeLimit,
		MemoryLimit:    CompileMemoryLimit,
		MemoryThrottle: CompileMemoryThrottle,
		FileSize:       CompileFileSize,
		OpenFile:       CompileOpenFile,
		NProc:          CompileNProc,
		ImagePath:      imagePath,
		Path:           "gcc",
		Stderr:         "/wd/stderr",
		Args: []string{
			"-o",
			"/wd/exec",
			"-Wall",
			"-std=gnu11",
			"-static",
			"-O2",
			"/wd/source.c",
		},
		Binds: []ugrade.FSBind{
			ugrade.FSBind{Host: workDir,
				Sandbox: "/wd",
			},
		},
	}

	usage, err := compiler.sandbox.Execute(ctx, cmd)
	if err != nil {
		return nil, ugrade.ErrCompilationError
	}

	return &jobsolver.CompilationResult{
		Usage:        usage,
		ExecDir:      workDir,
		ExecName:     "exec",
		RuntimeImage: runtimePath,
	}, nil
}
