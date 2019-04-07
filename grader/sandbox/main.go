package sandbox

import (
	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
)

type defaultSandbox struct {
	workingDir string
	sandboxDir string
}

// New create new default implementation of `grader.Sandbox`
func New() (grader.Sandbox, error) {
	sbox := &defaultSandbox{}
	if err := sbox.configure(); err != nil {
		return nil, errors.Wrap(err, "cannot initialize sandbox configuration")
	}
	return sbox, nil
}
