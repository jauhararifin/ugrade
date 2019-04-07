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
	duration time.Duration
	output   io.Reader
}

func (wk *defaultWorker) compileC(
	ctx context.Context,
	workingDirSbox,
	sourceFilename,
	outputFilename string,
) (compilationResult, error) {
	return compilationResult{}, nil
}

func (wk *defaultWorker) compileCpp11(
	ctx context.Context,
	workingDirSbox,
	sourceFilename,
	outputFilename string,
) (compilationResult, error) {
	cmd := grader.Command{
		Path: "g++",
		Args: []string{"-o", outputFilename, "-std=c++11", "-O3", sourceFilename},
		Dir:  workingDirSbox,
	}

	logrus.WithField("cmd", cmd).Debug("executing compilation script")
	startTime := time.Now()
	if err := wk.executor.ExecuteCommand(ctx, cmd); err != nil {
		return compilationResult{
			output: strings.NewReader("not yet implemented"),
		}, errors.Wrap(err, "error when executing compile script")
	}
	duration := time.Since(startTime)
	logrus.Debug("compile script successfully executed")

	return compilationResult{
		output:   strings.NewReader("not yet implemented"),
		duration: duration,
	}, nil
}

func (wk *defaultWorker) compile(
	ctx context.Context,
	workDirSbox string,
	languageID string,
	sourceFilename string,
	outputFilename string,
) (compilationResult, error) {
	if languageID == "1" { // C
		return wk.compileC(ctx, workDirSbox, sourceFilename, outputFilename)
	} else if languageID == "2" { // C++11
		return wk.compileCpp11(ctx, workDirSbox, sourceFilename, outputFilename)
	}
	return compilationResult{}, errors.Errorf("cannot compile using language with id %s", languageID)
}
