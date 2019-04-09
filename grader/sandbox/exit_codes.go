package sandbox

const (
	// ExitCodeTimeLimitExceeded is error code that returned by child process when
	// the command is exceeding specified time limit.
	ExitCodeTimeLimitExceeded = 11

	// ExitCodeMemoryLimitExceeded is error code that returned by child process when
	// the command is exceeding specified memory limit.
	ExitCodeMemoryLimitExceeded = 12
)
