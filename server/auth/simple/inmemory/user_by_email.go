package inmemory

import (
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func (m *inMemory) UserByEmail(contestID, email string) (*simple.User, error) {
	key := fmt.Sprintf("%s/%s", contestID, email)
	if uid, ok := m.mapContestEmail[key]; ok {
		return m.assertUserByID(uid, "mapContestEmail")
	}
	return nil, &noSuchUser{}
}
