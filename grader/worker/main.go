package worker

import "github.com/jauhararifin/ugrade/grader"

type defaultWorker struct {
}

// New create new default implementation of `grader.Worker`
func New() grader.Worker {
	return &defaultWorker{}
}
