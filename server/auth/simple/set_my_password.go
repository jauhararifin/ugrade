package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

// SetMyPassword updates user password.
func (s *Simple) SetMyPassword(token, oldPassword, newPassword string) error {
	errOld := validatePassword(oldPassword)
	errNew := validatePassword(newPassword)
	if errOld != nil || errNew != nil {
		errStr := ""
		if errOld != nil {
			errStr = errOld.Error()
		} else {
			errStr = errNew.Error()
		}
		return &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				password: errStr,
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

	if oldPassword != user.Password {
		return &authErr{
			msg:             "wrong credential",
			wrongCredential: true,
		}
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.MinCost)
	if errPass != nil {
		return errors.Wrap(err, "cannot hash password")
	}

	updatedUser := copyUser(user)
	updatedUser.Password = string(hashPass)

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}
