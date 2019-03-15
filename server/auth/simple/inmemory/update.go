package inmemory

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
	"github.com/pkg/errors"
)

func (m *inMemory) Update(ctx context.Context, userID string, newUser *simple.User) error {
	user, err := m.UserByID(ctx, userID)
	if err != nil {
		if _, ok := err.(*noSuchUser); ok {
			return &noSuchUser{}
		}
		return errors.Wrap(err, "cannot store updated user")
	}

	delete(m.mapIDUser, user.ID)
	m.mapIDUser[userID] = newUser

	if user.ContestID != newUser.ContestID {
		oldContestMap := m.mapContestUsers[user.ContestID]
		for i, uid := range oldContestMap {
			if uid == user.ID {
				m.mapContestUsers[user.ContestID] = append(oldContestMap[:i], oldContestMap[i+1:]...)
				break
			}
		}

		newContestMap := m.mapContestUsers[newUser.ContestID]
		newContestMap = append(newContestMap, newUser.ID)
		m.mapContestUsers[newUser.ContestID] = newContestMap
	}

	oldEmailKey := fmt.Sprintf("%s/%s", user.ContestID, user.Email)
	newEmailKey := fmt.Sprintf("%s/%s", newUser.ContestID, newUser.Email)
	delete(m.mapContestEmail, oldEmailKey)
	m.mapContestEmail[newEmailKey] = newUser.ID

	oldUsernameKey := fmt.Sprintf("%s/%s", user.ContestID, user.Username)
	newUsernameKey := fmt.Sprintf("%s/%s", newUser.ContestID, newUser.Username)
	delete(m.mapContestUsername, oldUsernameKey)
	m.mapContestUsername[newUsernameKey] = newUser.ID

	delete(m.mapToken, user.Token)
	m.mapToken[newUser.Token] = newUser.ID

	return nil
}
