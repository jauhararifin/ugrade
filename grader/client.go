package grader

import (
	"context"
	"fmt"
)

// ErrNoSuchJob indicating that currently no active job to be done.
var ErrNoSuchJob = fmt.Errorf("no such job")

// Client is used for interacting with ugrade server API.
type Client interface {
	GetJob(ctx context.Context, token string) (*Job, error)
	SubmitJob(ctx context.Context, token string, jobResult JobResult) error
}
