package inmemory

import (
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
	"github.com/pkg/errors"
)

func (m *inMemory) UserByID(userID string) (*simple.User, error) {
	if user, ok := m.mapIDUser[userID]; ok {
		return user, nil
	}
	return nil, &noSuchUser{}
}

// assertUserByID returns user by its id. If no such user is found, then return invalid state error.
func (m *inMemory) assertUserByID(userID string, fromMap string) (*simple.User, error) {
	user, err := m.UserByID(userID)
	if err != nil {
		if _, ok := err.(*noSuchUser); ok {
			return nil, &invalidState{
				msg: fmt.Sprintf("invalid state, %s found in %s but doesn't found in %s", userID, fromMap, "mapIDUser"),
			}
		}
		return nil, errors.Wrap(err, "cannot get users from storage")
	}
	return user, nil
}
