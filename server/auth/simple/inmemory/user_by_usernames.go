package inmemory

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func (m *inMemory) UserByUsernames(ctx context.Context, contestID string, usernames []string) ([]*simple.User, error) {
	if _, ok := m.mapContestUsers[contestID]; !ok {
		return nil, &noSuchContest{}
	}
	result := make([]*simple.User, 0, len(usernames))
	for _, uname := range usernames {
		key := fmt.Sprintf("%s/%s", contestID, uname)
		if uid, ok := m.mapContestUsername[key]; ok {
			user, err := m.assertUserByID(ctx, uid, "mapContestEmail")
			if err != nil {
				return nil, err
			}
			result = append(result, user)
		}
	}
	return result, nil
}
