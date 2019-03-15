package inmemory

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func (m *inMemory) UserByToken(ctx context.Context, token string) (*simple.User, error) {
	if uid, ok := m.mapToken[token]; ok {
		return m.assertUserByID(ctx, uid, "mapContestEmail")
	}
	return nil, &noSuchUser{}
}
