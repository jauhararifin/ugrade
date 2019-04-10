package cpu

import (
	"errors"
	"time"
)

const pollingDelay = 100 * time.Millisecond // how fast we poll the cpu usage

// ErrTimeLimitExceeded indicates that the process exceeding time limit that has been specified.
var ErrTimeLimitExceeded = errors.New("time limit exceeded")

// Limiter represent cpu usage limiter.
type Limiter struct {
	// Name should be unique of all limiter.
	Name string

	// Limit indicates the maximum number of cpu time used by process. The process
	// will be killed when exceeding this limit.
	Limit time.Duration
}
