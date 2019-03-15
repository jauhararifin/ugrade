package inmemory

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func (m *inMemory) UserByEmail(ctx context.Context, contestID, email string) (*simple.User, error) {
	key := fmt.Sprintf("%s/%s", contestID, email)
	if uid, ok := m.mapContestEmail[key]; ok {
		return m.assertUserByID(ctx, uid, "mapContestEmail")
	}
	return nil, &noSuchUser{}
}
