package cgroup

import "github.com/pkg/errors"

type tleError struct{ error }

func (err *tleError) TimeLimitExceeded() bool {
	return true
}

// ErrTimeLimitExceeded implements `sandbox.TimeLimitExceeded`
var ErrTimeLimitExceeded = &tleError{errors.New("process used too much cpu time")}

type mleError struct{ error }

func (err *mleError) MemoryLimitExceeded() bool {
	return true
}

// ErrMemoryLimitExceeded implements `sandbox.MemoryLimitExceeded`
var ErrMemoryLimitExceeded = &mleError{errors.New("process used too memory")}
