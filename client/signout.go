package client

import (
	"context"
	"os"

	"golang.org/x/xerrors"
)

func (clt *client) SignOut(ctx context.Context) error {
	tokenPath, err := assertWorkingFile("session.tk")
	if err != nil {
		return xerrors.Errorf("cannot inspect session file: %w", err)
	}
	if err := os.Remove(tokenPath); err != nil {
		return xerrors.Errorf("cannot remove session file: %w", err)
	}
	return nil
}
