package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

// SetMyName updates user's name information.
func (s *Simple) SetMyName(token, name string) error {
	if err := validateName(name); err != nil {
		return &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				name: err.Error(),
			},
		}
	}

	user, err := s.store.UserByToken(token)
	if auth.IsNoSuchUser(err) {
		return &authErr{
			msg:            "invalid session token",
			invalidSession: true,
		}
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	updatedUser := copyUser(user)
	updatedUser.Name = name

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}
