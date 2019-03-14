package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/otc"
	"github.com/pkg/errors"
)

// ForgotPassword used by user to send reset password request.
func (s *Simple) ForgotPassword(contestID, email string) error {
	user, err := s.store.UserByEmail(contestID, email)
	if auth.IsNoSuchUser(err) {
		return err
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	updatedUser := copyUser(user)
	updatedUser.ResetPasswordOTC = otc.Random()

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}
