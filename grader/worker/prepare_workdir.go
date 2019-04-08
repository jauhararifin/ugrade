package worker

import (
	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (worker *defaultWorker) prepareWorkDir() (*sandbox.Path, error) {
	logrus.Debug("preparing working directory for executing job")
	workDir, err := worker.executor.PrepareDir()
	if err != nil {
		return nil, errors.Wrap(err, "cannot create working directory inside sandbox")
	}
	logrus.WithField("workDir", workDir).Debug("working directory created")
	return workDir, nil
}
