package worker

import (
	"context"
	"io"
	"strings"
	"time"

	"github.com/jauhararifin/ugrade/grader"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type compilationResult struct {
	duration   time.Duration
	output     io.Reader
	workDir    workingDirectory
	executable string
}

func (worker *defaultWorker) compileC(
	ctx context.Context,
	workDir workingDirectory,
	sourceFilename,
	outputFilename string,
) (compilationResult, error) {
	return compilationResult{}, nil
}

func (worker *defaultWorker) compileCpp11(
	ctx context.Context,
	workDir workingDirectory,
	sourceFilename,
	outputFilename string,
) (compilationResult, error) {
	cmd := grader.Command{
		Path: "g++",
		Args: []string{"-o", outputFilename, "-std=c++11", "-O3", sourceFilename},
		Dir:  workDir.sandboxPath,
	}

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
		executable: outputFilename,
	}, nil
}

func (worker *defaultWorker) compile(
	ctx context.Context,
	workDir workingDirectory,
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
