package worker

import (
	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
)

type defaultWorker struct {
	workingDir string
	rootFSDir  string
}

// New create new default implementation of `grader.Worker`
func New() (grader.Worker, error) {
	worker := &defaultWorker{}
	if _, err := worker.assertWorkingDir(); err != nil {
		return nil, errors.Wrap(err, "error initializing worker")
	}
	if _, err := worker.assertRootFSDir(); err != nil {
		return nil, errors.Wrap(err, "error initializing worker")
	}
	return worker, nil
}
