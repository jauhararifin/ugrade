package ugrade

import (
	"context"
	"os"

	"github.com/pkg/errors"
)

func (clt *client) SignOut(ctx context.Context) error {
	file, tokenPath, err := assertWorkingFile("session.tk")
	if err == nil {
		defer file.Close()
		if err := os.Remove(tokenPath); err != nil {
			return errors.Wrap(err, "cannot remove session file")
		}
	}
	return nil
}
