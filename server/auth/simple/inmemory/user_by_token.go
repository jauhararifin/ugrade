package inmemory

import "github.com/jauhararifin/ugrade/server/auth/simple"

func (m *inMemory) UserByToken(token string) (*simple.User, error) {
	if uid, ok := m.mapToken[token]; ok {
		return m.assertUserByID(uid, "mapContestEmail")
	}
	return nil, &noSuchUser{}
}
