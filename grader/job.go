package grader

import "io"

// Job represent grading job in ugrade.
type Job struct {
	Token string
	Spec  io.ReadCloser
}

// JobResult respresent of result after job finished.
type JobResult struct {
	Job     Job
	Verdict string
	Output  io.ReadCloser
}
