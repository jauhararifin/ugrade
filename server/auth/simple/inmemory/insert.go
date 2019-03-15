package inmemory

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
	"github.com/pkg/errors"
)

func (m *inMemory) Insert(_ context.Context, users []*simple.User) error {
	for _, user := range users {
		if _, ok := m.mapIDUser[user.ID]; ok {
			return errors.Errorf("user with id %s already defined", user.ID)
		}

		if _, ok := m.mapContestUsers[user.ContestID]; !ok {
			m.mapContestUsers[user.ContestID] = make([]string, 0, 0)
		}

		emailKey := fmt.Sprintf("%s/%s", user.ContestID, user.Email)
		if _, ok := m.mapContestEmail[emailKey]; ok {
			return errors.Errorf("user with email %s already defined", user.Email)
		}

		usernameKey := fmt.Sprintf("%s/%s", user.ContestID, user.Username)
		if _, ok := m.mapContestUsername[usernameKey]; ok {
			return errors.Errorf("user with username %s already defined", user.Username)
		}

		if _, ok := m.mapToken[user.Token]; ok {
			return errors.Errorf("user with token %s already defined", user.Token)
		}
	}

	for _, user := range users {
		m.mapIDUser[user.ID] = user

		m.mapContestUsers[user.ContestID] = append(m.mapContestUsers[user.ContestID], user.ID)

		emailKey := fmt.Sprintf("%s/%s", user.ContestID, user.Email)
		m.mapContestEmail[emailKey] = user.ID

		usernameKey := fmt.Sprintf("%s/%s", user.ContestID, user.Username)
		m.mapContestUsername[usernameKey] = user.ID

		if len(user.Token) > 0 {
			m.mapToken[user.Token] = user.ID
		}
	}

	return nil
}
