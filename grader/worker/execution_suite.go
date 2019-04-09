package worker

import (
	"context"
	"path/filepath"
	"strings"
	"time"

	"github.com/jauhararifin/ugrade/grader/sandbox"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type execution struct {
	duration time.Duration
	err      error
	input    string
	output   string
}

type executionSuite struct {
	workDir    sandbox.Path
	executions []execution
}

func (worker *defaultWorker) executeSuite(
	ctx context.Context,
	input inputFiles,
	compiled compilationResult,
	outputPrefix string,
	timelimit,
	memlimit uint32,
) (*executionSuite, error) {
	executions := make([]execution, 0, 0)
	for _, infile := range input.files {
		outfile := outputPrefix + strings.TrimSuffix(infile, filepath.Ext(infile)) + ".out"

		logrus.WithField("inputFile", infile).WithField("outputFile", outfile).Trace("execute suite item")
		res, err := worker.runWithFile(ctx, compiled, []string{infile}, infile, outfile, timelimit, memlimit)
		if err != nil {
			return nil, errors.Wrap(err, "cannot run suite item")
		}

		executions = append(executions, execution{
			duration: res.duration,
			input:    infile,
			output:   outfile,
		})
	}

	return &executionSuite{
		executions: executions,
		workDir:    compiled.workDir,
	}, nil
}
