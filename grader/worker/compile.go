package worker

import (
	"bytes"
	"context"
	"io"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type compilationResult struct {
	executable io.Reader
	output     io.Reader
}

func (wk *defaultWorker) compileC(ctx context.Context, sourceCode io.Reader) (compilationResult, error) {
	return compilationResult{}, nil
}

func (wk *defaultWorker) compileCpp11(ctx context.Context, sourceCode io.Reader) (compilationResult, error) {
	logrus.Debug("creating compilation output file")
	result, err := tempFile("", "")
	if err != nil {
		return compilationResult{}, errors.Wrap(err, "cannot create output file")
	}
	logrus.Debug("compilation output file created")

	var errorOutput bytes.Buffer
	cmd := Command{
		Path:   "/usr/lib/g++",
		Args:   []string{"-o", "/dev/stdout", "-std=c++11", "-O3", "/dev/stdin"},
		Dir:    "/home",
		Stdin:  sourceCode,
		Stdout: result,
		Stderr: &errorOutput,
	}

	logrus.Debug("executing compilation script")
	err = wk.executeCommand(ctx, cmd)
	if err != nil {
		return compilationResult{
			output: &errorOutput,
		}, errors.Wrap(err, "error when executing compile script")
	}
	logrus.Debug("compile script successfully executed")

	return compilationResult{
		output:     &errorOutput,
		executable: result,
	}, nil
}

func (wk *defaultWorker) compile(ctx context.Context, languageID string, sourceCode io.Reader) (compilationResult, error) {
	if languageID == "1" { // C
		return wk.compileC(ctx, sourceCode)
	} else if languageID == "2" { // C++11
		return wk.compileCpp11(ctx, sourceCode)
	}
	return compilationResult{}, errors.Errorf("cannot compile using language with id %s", languageID)
}
