package sandbox

import (
	"context"
	"time"
)

// Usage represent resource usage of process inside sandbox.
type Usage struct {
	Memory   uint64
	CPU      time.Duration
	WallTime time.Duration
}

// Guard run `Command` and monitor system resource limit, and kill process
// when exceeding the limit.
type Guard interface {
	Run(ctx context.Context, cmd Command) (Usage, error)
}
