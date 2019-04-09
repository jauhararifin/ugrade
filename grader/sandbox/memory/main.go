package memory

import "errors"

const memoryPollingDelay = 100 // how fast we poll the memory usage, in milisecond

// ErrMemoryLimitExceeded indicates that memory limit is exceeded by processes.
var ErrMemoryLimitExceeded = errors.New("memory limit exceeded")

// Limiter represent memory limiter.
type Limiter struct {
	// Throttle will limit memory consumption of process.
	// The process will throttled when memory usage exceeding this limit, but not kill the process.
	Throttle uint64

	// Limit will limit memory consumption of process and kill the process if the memory usage
	// exceeding this value.
	Limit uint64

	// Name should be unique of all limiter.
	Name string
}
