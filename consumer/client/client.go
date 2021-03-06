package client

import (
	"context"
	"io"

	"github.com/jauhararifin/ugrade"
)

// Job represent grading job in ugrade.
type Job struct {
	Token string
	Spec  io.ReadCloser
}

// JobResult respresent of result after job finished.
type JobResult struct {
	Job     *Job
	Output  io.ReadCloser
	Verdict ugrade.Verdict
}

// Client is used for interacting with ugrade server API.
type Client interface {
	// GetJob send request to server asking for a job to execute. When there are no available jobs, GetJob will gives
	// ErrNoSuchJob error. When there is a job available, GetJob will return `Job` struct that contains token and spec.
	// The spec field in `Job` struct is a `ReadCloser`, so you need to close it when it no longer used. You don't have
	// to close it if `GetJob` gives you an error.
	GetJob(ctx context.Context, token string) (*Job, error)

	// SubmitJob send grading result of a job to the server.
	SubmitJob(ctx context.Context, token string, jobResult JobResult) error
}
