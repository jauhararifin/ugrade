package executor

import "github.com/pkg/errors"

type runtimeError struct{ error }

// RuntimeErrors implement `sandbox.RuntimeError`
func (*runtimeError) RuntimeError() bool {
	return true
}

type tleError struct{ error }

// TimeLimitExceeded implement `sandbox.TimeLimitExceeded`
func (*tleError) TimeLimitExceeded() bool {
	return true
}

type mleError struct{ error }

// MemoryLimitExceeded implement `sandbox.MemoryLimitExceeded`
func (*tleError) MemoryLimitExceeded() bool {
	return true
}

type ieError struct{ error }

// InternalError implement `sandbox.InternalError`
func (*ieError) InternalError() bool {
	return true
}

var errRTE = &runtimeError{errors.New("runtime error")}
var errMLE = &mleError{errors.New("memory limit exceeded")}
var errTLE = &tleError{errors.New("time limit exceeded")}
var errIE = &ieError{errors.New("internal error")}
