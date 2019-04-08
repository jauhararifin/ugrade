package worker

import (
	"context"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (worker *defaultWorker) compileChecker(
	ctx context.Context,
	spec extractedSpec,
) (compilationResult, error) {
	logrus.Debug("compiling checker")
	checkerRes, err := worker.compile(
		ctx,
		spec.workDir,
		spec.checker.language,
		spec.checker.filename,
		"checkerexec",
	)
	if err != nil {
		return checkerRes, errors.Wrap(err, "cannot compile checker")
	}
	logrus.WithField("compileResult", checkerRes).Debug("checker compiled")
	return checkerRes, nil
}
