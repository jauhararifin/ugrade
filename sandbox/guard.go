package sandbox

import (
	"context"

	"github.com/jauhararifin/ugrade"
)

// Guard run `Command` and monitor system resource limit, and kill process
// when exceeding the limit.
type Guard interface {
	Run(ctx context.Context, cmd ugrade.Command) (ugrade.Usage, error)
}
