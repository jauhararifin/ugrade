package worker

import (
	"github.com/jauhararifin/ugrade/grader/sandbox"
	"github.com/pkg/errors"
)

func (wk *defaultWorker) configure() error {
	executor, err := sandbox.New()
	if err != nil {
		return errors.Wrap(err, "cannot initialize worker configuration")
	}
	wk.executor = executor
	return nil
}
