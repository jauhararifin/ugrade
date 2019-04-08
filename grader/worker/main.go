package worker

import (
	"github.com/jauhararifin/ugrade/grader"
	"github.com/jauhararifin/ugrade/grader/sandbox"
	"github.com/pkg/errors"
)

type defaultWorker struct {
	executor sandbox.Sandbox
}

// New create new default implementation of `grader.Worker`
func New() (grader.Worker, error) {
	worker := &defaultWorker{}
	if err := worker.configure(); err != nil {
		return nil, errors.Wrap(err, "error configuring worker")
	}
	return worker, nil
}
