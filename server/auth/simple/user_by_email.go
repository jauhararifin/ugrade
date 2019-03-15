package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

// UserByEmail returns specific user by combination if its contestID and email. When no such user if found, returned ErrNoSuchUser.
func (s *Simple) UserByEmail(ctx context.Context, contestID, email string) (*auth.User, error) {
	if err := validateEmail(email); err != nil {
		return nil, &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				email: err.Error(),
			},
		}
	}
	user, err := s.store.UserByEmail(ctx, contestID, email)
	if auth.IsNoSuchUser(err) {
		return nil, err
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch user")
	}
	return user.User, nil
}
