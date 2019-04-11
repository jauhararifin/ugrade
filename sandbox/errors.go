package sandbox

// MemoryLimitExceeded indicates that the error is because of memory limit is exceeded.
type MemoryLimitExceeded interface {
	error
	MemoryLimitExceeded() bool
}

// TimeLimitExceeded indicates that the error is because of cpu time limit is exceeded.
type TimeLimitExceeded interface {
	error
	TimeLimitExceeded() bool
}
