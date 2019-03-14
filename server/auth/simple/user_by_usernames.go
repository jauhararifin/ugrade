package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

// UserByUsernames returns slices of users by its username in specific contest. When no such contest if found, returned ErrNoSuchContest.
func (s *Simple) UserByUsernames(contestID string, usernames []string) ([]*auth.User, error) {
	users, err := s.store.UserByUsernames(contestID, usernames)
	if auth.IsNoSuchContest(err) {
		return nil, err
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch users")
	}
	result := make([]*auth.User, len(users))
	for _, u := range users {
		result = append(result, u.User)
	}
	return result, nil
}
