package worker

import (
	"context"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (worker *defaultWorker) compileTCGen(
	ctx context.Context,
	spec extractedSpec,
) (compilationResult, error) {
	logrus.Debug("compiling testcase generator")
	tcgenCompRes, err := worker.compile(
		ctx,
		spec.workDir,
		spec.tcgen.language,
		spec.tcgen.filename,
		"tcgenexec",
	)
	if err != nil {
		return tcgenCompRes, errors.Wrap(err, "cannot compile testcase generator")
	}
	logrus.WithField("compileResult", tcgenCompRes).Debug("testcase generator compiled")
	return tcgenCompRes, nil
}
