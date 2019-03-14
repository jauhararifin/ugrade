package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

// Me returns User information based on their's session token.
func (s *Simple) Me(token string) (*auth.User, error) {
	user, err := s.store.UserByToken(token)
	if auth.IsNoSuchUser(err) {
		return nil, &authErr{
			msg:            "invalid session token",
			invalidSession: true,
		}
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch user")
	}
	return user.User, nil
}
