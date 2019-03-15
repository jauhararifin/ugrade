package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

// ResetPassword used by user to reset their password.
func (s *Simple) ResetPassword(ctx context.Context, contestID, email, oneTimeCode, password string) error {
	if err := validatePassword(password); err != nil {
		return &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				password: err.Error(),
			},
		}
	}

	user, err := s.store.UserByEmail(ctx, contestID, email)
	if auth.IsNoSuchUser(err) {
		return err
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	if len(user.ResetPasswordOTC) == 0 || user.ResetPasswordOTC != oneTimeCode {
		return &authErr{
			msg:        "wrong one time code",
			wrongToken: true,
		}
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if errPass != nil {
		return errors.Wrap(errPass, "cannot hash password")
	}

	user.Password = string(hashPass)
	user.ResetPasswordOTC = ""
	if err := s.store.Update(ctx, user.ID, user); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}
