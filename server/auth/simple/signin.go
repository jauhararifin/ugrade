package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/uuid"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

// SignIn authenticate combination of contestId, email and password and returns session token when success, otherwise return ErrWrongCredential error.
func (s *Simple) SignIn(ctx context.Context, contestID, email, password string) (string, error) {
	user, err := s.store.UserByEmail(ctx, contestID, email)
	if auth.IsNoSuchUser(err) {
		return "", &authErr{
			msg:             "wrong credential",
			wrongCredential: true,
		}
	}
	if err != nil {
		return "", errors.Wrap(err, "cannot fetch user")
	}

	byteDbPass := []byte(user.Password)
	bytePass := []byte(password)
	if err := bcrypt.CompareHashAndPassword(byteDbPass, bytePass); err != nil {
		return "", &authErr{
			msg:             "wrong credential",
			wrongCredential: true,
		}
	}

	if len(user.Token) > 0 {
		return user.Token, nil
	}

	token, err := s.store.IssueToken(ctx, user.ID, uuid.Random())
	if err != nil {
		return "", errors.Wrap(err, "cannot issue token")
	}
	return token, nil
}
