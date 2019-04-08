package worker

import (
	"context"
	"path/filepath"
	"strings"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type execution struct {
	duration time.Duration
	input    string
	output   string
}

type executionSuite struct {
	workDir    workingDirectory
	executions []execution
}

func (worker *defaultWorker) executeSuite(
	ctx context.Context,
	input inputFiles,
	compiled compilationResult,
) (*executionSuite, error) {
	executions := make([]execution, 0, 0)
	for _, infile := range input.files {
		outfile := strings.TrimSuffix(infile, filepath.Ext(infile)) + ".out"
		logrus.WithField("inputFile", infile).WithField("outputFile", outfile).Trace("execute suite item")
		res, err := worker.runWithFile(ctx, compiled, []string{}, infile, outfile)
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
