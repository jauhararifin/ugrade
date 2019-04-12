package guard

import "errors"

type runtimeError struct{ error }

// RuntimeErrors implement `sandbox.RuntimeError`
func (*runtimeError) RuntimeError() bool {
	return true
}

var errRTE = &runtimeError{errors.New("runtime error")}
