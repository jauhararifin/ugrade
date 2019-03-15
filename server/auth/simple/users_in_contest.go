package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

// UsersInContest returns all users in a contest. If no such contest is found, then returned NoSuchContest.
func (s *Simple) UsersInContest(ctx context.Context, contestID string) ([]*auth.User, error) {
	users, err := s.store.UsersInContest(ctx, contestID)
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
