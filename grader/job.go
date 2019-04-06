package grader

import (
	"fmt"
	"io"
)

// Job represent grading job in ugrade.
type Job struct {
	Token string
	Spec  io.ReadCloser
}

func (job Job) String() string {
	// TODO: use json
	return job.Token
}

// JobResult respresent of result after job finished.
type JobResult struct {
	Job     Job
	Verdict string
	Output  io.ReadCloser
}

func (jobResult JobResult) String() string {
	// TODO: use json
	return fmt.Sprintf("%s - %s", jobResult.Job, jobResult.Verdict)
}
