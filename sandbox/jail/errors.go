package jail

import (
	"fmt"
)

type runtimeError struct{ error }

func (runtimeError) RuntimeError() bool {
	return true
}

func rte(code int) runtimeError {
	return runtimeError{fmt.Errorf("runtime error with exit code: %d", code)}
}
