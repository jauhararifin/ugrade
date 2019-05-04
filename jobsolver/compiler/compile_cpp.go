package compiler

import (
	"context"
	"io/ioutil"
	"path"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver"
	"github.com/jauhararifin/ugrade/jobsolver/file"
	"github.com/jauhararifin/ugrade/jobsolver/image"
	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

func (compiler *defaultCompiler) compileCPP11(
	ctx context.Context,
	sourceFilename string,
) (*jobsolver.CompilationResult, error) {
	imagePath, err := image.Path("gxx-compiler")
	if err != nil {
		return nil, xerrors.Errorf("cannot find gxx-compiler image: %w", err)
	}

	runtimePath, err := image.Path("static-runtime")
	if err != nil {
		return nil, xerrors.Errorf("cannot find static-runtime image: %w", err)
	}

	workDir, err := ioutil.TempDir("", "ugrade-compilation")
	if err != nil {
		return nil, xerrors.Errorf("cannot create temporary working directory: %w", err)
	}

	if err := file.Copy(sourceFilename, path.Join(workDir, "source.cpp")); err != nil {
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
		Binds: []ugrade.FSBind{
			ugrade.FSBind{Host: workDir,
				Sandbox: "/wd",
			},
		},
	}

	logrus.WithField("cmd", cmd).Trace("compiling")
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
