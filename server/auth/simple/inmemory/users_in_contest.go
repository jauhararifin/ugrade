package inmemory

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func (m *inMemory) UsersInContest(ctx context.Context, contestID string) ([]*simple.User, error) {
	users, ok := m.mapContestUsers[contestID]
	if !ok {
		return nil, &noSuchContest{}
	}
	result := make([]*simple.User, 0, len(users))
	for _, uid := range users {
		user, err := m.assertUserByID(ctx, uid, "contestUsers")
		if err != nil {
			return nil, err
		}
		result = append(result, user)
	}
	return result, nil
}
