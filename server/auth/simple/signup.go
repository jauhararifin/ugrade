package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/uuid"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

// SignUp used by used when they first time join the contest. It takes user information such as name, username and passwod and returned session token when success.
func (s *Simple) SignUp(ctx context.Context, contestID, username, email, oneTimeCode, password, name string) (string, error) {
	errUsername := validateUsername(username)
	errName := validateName(name)
	errPasswd := validatePassword(password)
	if errUsername != nil || errName != nil || errPasswd != nil {
		err := &invalidInputErr{}
		if errUsername != nil {
			err.username = errUsername.Error()
		}
		if errName != nil {
			err.name = errName.Error()
		}
		if errPasswd != nil {
			err.password = errPasswd.Error()
		}
		return "", &authErr{
			msg:          "invalid input",
			invalidInput: err,
		}
	}

	uu, err := s.store.UserByUsernames(ctx, contestID, []string{username})
	if auth.IsNoSuchContest(err) {
		return "", err
	}
	if err != nil {
		return "", errors.Wrap(err, "cannot fetch users")
	}
	if len(uu) > 0 {
		return "", &authErr{
			msg:                 "username already used",
			usernameAlreadyUsed: true,
		}
	}

	user, err := s.store.UserByEmail(ctx, contestID, email)
	if auth.IsNoSuchUser(err) {
		return "", err
	}
	if err != nil {
		return "", errors.Wrap(err, "cannot fetch user")
	}

	if user.SignedUp {
		return "", &authErr{
			msg:             "already signed up",
			alreadySignedUp: true,
		}
	}

	if len(user.SignUpOTC) == 0 || user.SignUpOTC != oneTimeCode {
		return "", &authErr{
			msg:        "wrong one time code",
			wrongToken: true,
		}
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if errPass != nil {
		return "", errors.Wrap(errPass, "cannot hash password")
	}

	token := uuid.Random()

	updatedUser := copyUser(user)
	updatedUser.Name = name
	updatedUser.Password = string(hashPass)
	updatedUser.Token = token
	updatedUser.SignUpOTC = ""
	updatedUser.ResetPasswordOTC = ""

	if err := s.store.Update(ctx, user.ID, updatedUser); err != nil {
		return "", errors.Wrap(err, "cannot update user")
	}
	return token, nil
}
