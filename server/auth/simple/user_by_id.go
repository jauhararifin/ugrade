package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

// UserByID returns specific User by its ID. If no such user is found, then returned NoSuchUser.
func (s *Simple) UserByID(ctx context.Context, userID string) (*auth.User, error) {
	user, err := s.store.UserByID(ctx, userID)
	if auth.IsNoSuchUser(err) {
		return nil, err
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch user")
	}
	return user.User, nil
}
