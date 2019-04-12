package jail

import (
	"fmt"
)

type runtimeError error

func (runtimeError) RuntimeError() bool {
	return true
}

func rte(code int) runtimeError {
	return fmt.Errorf("runtime error with exit code: %d", code)
}
