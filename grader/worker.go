package grader

import "context"

type Worker interface {
	Execute(ctx context.Context, job Job) (*JobResult, error)
}
