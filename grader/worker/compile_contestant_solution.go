package worker

import (
	"context"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (worker *defaultWorker) compileContestantSolution(
	ctx context.Context,
	spec extractedSpec,
) (*compilationResult, error) {
	logrus.Debug("compiling contestant solution")
	solutionRes, err := worker.compile(
		ctx,
		spec.workDir,
		spec.submission.language,
		spec.submission.filename,
		"contestantexec",
	)
	if err != nil {
		return nil, errors.Wrap(err, "cannot compile contestant solution")
	}
	logrus.WithField("compileResult", solutionRes).Debug("contestant solution compiled")
	return solutionRes, nil
}
