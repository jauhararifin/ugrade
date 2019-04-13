package executor

import (
	"context"

	"github.com/jauhararifin/ugrade/sandbox"
)

type Executor interface {
	Execute(ctx context.Context, cmd sandbox.Command) error
}
