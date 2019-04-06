package grader

import "context"

// Worker execute job from server and give job result.
type Worker interface {
	Execute(ctx context.Context, job Job) (*JobResult, error)
}
