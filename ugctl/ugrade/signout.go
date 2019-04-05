package ugrade

import (
	"context"
	"os"

	"github.com/pkg/errors"
)

func (clt *client) SignOut(ctx context.Context) error {
	sessionFile := "~/.ugrade/session.tk"
	if _, err := os.Stat(sessionFile); os.IsNotExist(err) {
		return nil
	}
	if err := os.Remove(sessionFile); err != nil {
		return errors.Wrap(err, "cannot remove session file")
	}
	return nil
}
