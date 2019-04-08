package worker

import (
	"os"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type workingDirectory struct {
	hostPath    string
	sandboxPath string
}

func (wd *workingDirectory) remove() error {
	return os.RemoveAll(wd.hostPath)
}

func (worker *defaultWorker) prepareWorkDir() (*workingDirectory, error) {
	logrus.Debug("preparing working directory for executing job")
	workDir, workDirSbox, err := worker.executor.PrepareDir()
	if err != nil {
		return nil, errors.Wrap(err, "cannot create working directory inside sandbox")
	}
	result := workingDirectory{
		hostPath:    workDir,
		sandboxPath: workDirSbox,
	}
	logrus.WithField("workDir", result).Debug("working directory created")
	return &result, nil
}
