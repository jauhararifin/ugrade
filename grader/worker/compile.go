package worker

import (
	"context"
	"io"
	"strings"
	"time"

	"github.com/jauhararifin/ugrade/grader/sandbox"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type compilationResult struct {
	duration   time.Duration
	output     io.Reader
	workDir    sandbox.Path
	source     string
	executable string
}

func (worker *defaultWorker) genericCompile(
	ctx context.Context,
	workDir sandbox.Path,
	sourceFilename,
	outputFilename string,
	cmd sandbox.Command,
) (compilationResult, error) {
	cmd.TimeLimit = 10000              // limit 10 seconds for compiling
	cmd.MemoryLimit = 64 * 1024 * 1024 // limit 64MB for compiling
	logrus.WithField("cmd", cmd).Debug("executing compilation script")
	startTime := time.Now()
	if err := worker.executor.ExecuteCommand(ctx, cmd); err != nil {
		return compilationResult{
			output:   strings.NewReader("not yet implemented"),
			duration: time.Since(startTime),
		}, errors.Wrap(err, "error when executing compile script")
	}
	duration := time.Since(startTime)
	logrus.Debug("compile script successfully executed")

	return compilationResult{
		output:     strings.NewReader("not yet implemented"),
		duration:   duration,
		workDir:    workDir,
		source:     sourceFilename,
		executable: outputFilename,
	}, nil
}

func (worker *defaultWorker) compileC(
	ctx context.Context,
	workDir sandbox.Path,
	sourceFilename,
	outputFilename string,
) (compilationResult, error) {
	cmd := sandbox.Command{
		Path: "gcc",
		Args: []string{
			"-o", outputFilename,
			"-Wall",
			"-std=gnu11",
			"-O2",
			sourceFilename,
		},
		Dir: workDir,
	}
	return worker.genericCompile(ctx, workDir, sourceFilename, outputFilename, cmd)
}

func (worker *defaultWorker) compileCpp11(
	ctx context.Context,
	workDir sandbox.Path,
	sourceFilename,
	outputFilename string,
) (compilationResult, error) {
	cmd := sandbox.Command{
		Path: "g++",
		Args: []string{"-o", outputFilename, "-std=c++11", "-O3", sourceFilename},
		Dir:  workDir,
	}
	return worker.genericCompile(ctx, workDir, sourceFilename, outputFilename, cmd)
}

func (worker *defaultWorker) compile(
	ctx context.Context,
	workDir sandbox.Path,
	languageID string,
	sourceFilename string,
	outputFilename string,
) (compilationResult, error) {
	if languageID == "1" { // C
		return worker.compileC(ctx, workDir, sourceFilename, outputFilename)
	} else if languageID == "2" { // C++11
		return worker.compileCpp11(ctx, workDir, sourceFilename, outputFilename)
	}
	return compilationResult{}, errors.Errorf("cannot compile using language with id %s", languageID)
}
