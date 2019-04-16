package ugrade

import (
	"context"

	"golang.org/x/xerrors"
)

// ErrNoSuchJob indicating that currently no active job to be done.
var ErrNoSuchJob = xerrors.New("no such job")

// Consumer consume job from server and send result
type Consumer interface {
	Consume(ctx context.Context, token string) error
}
