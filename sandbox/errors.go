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

// InternalError indicates that the error is because of internal server problem.
type InternalError interface {
	error
	InternalError() bool
}

// RuntimeError indicates that the error is because of executable gives non zero exit code.
type RuntimeError interface {
	error
	RuntimeError() bool
}
