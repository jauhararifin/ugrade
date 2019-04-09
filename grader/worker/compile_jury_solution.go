package worker

import (
	"context"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (worker *defaultWorker) compileJurySolution(
	ctx context.Context,
	spec extractedSpec,
) (*compilationResult, error) {
	logrus.Debug("compiling jury solution")
	solutionRes, err := worker.compile(
		ctx,
		spec.workDir,
		spec.solution.language,
		spec.solution.filename,
		"solutionexec",
	)
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile jury solution")
	}
	logrus.WithField("compileResult", solutionRes).Debug("jury solution compiled")
	return solutionRes, nil
}
