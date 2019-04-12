package sandbox

import "context"

// Guard run `Command` and monitor system resource limit, and kill process
// when exceeding the limit.
type Guard interface {
	Run(ctx context.Context, cmd Command) error
}
