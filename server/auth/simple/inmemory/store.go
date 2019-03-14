package inmemory

import (
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

type inMemory struct {
	mapIDUser          map[string]*simple.User
	mapContestUsers    map[string][]string
	mapContestEmail    map[string]string
	mapContestUsername map[string]string
	mapToken           map[string]string
}

// New create a new in memory store.
func New() simple.Store {
	return &inMemory{
		mapIDUser:          make(map[string]*simple.User),
		mapContestUsers:    make(map[string][]string),
		mapContestEmail:    make(map[string]string),
		mapContestUsername: make(map[string]string),
		mapToken:           make(map[string]string),
	}
}

// NewWithFixture create a new in memory store with some predifined user.
func NewWithFixture(fixture []*simple.User) simple.Store {
	m := &inMemory{
		mapIDUser:          make(map[string]*simple.User),
		mapContestUsers:    make(map[string][]string),
		mapContestEmail:    make(map[string]string),
		mapContestUsername: make(map[string]string),
		mapToken:           make(map[string]string),
	}
	for _, user := range fixture {
		m.mapIDUser[user.ID] = user

		if _, ok := m.mapContestUsers[user.ContestID]; !ok {
			m.mapContestUsers[user.ContestID] = make([]string, 0, 0)
		}
		m.mapContestUsers[user.ContestID] = append(m.mapContestUsers[user.ContestID], user.ID)

		emailKey := fmt.Sprintf("%s/%s", user.ContestID, user.Email)
		m.mapContestEmail[emailKey] = user.ID

		usernameKey := fmt.Sprintf("%s/%s", user.ContestID, user.Username)
		m.mapContestUsername[usernameKey] = user.ID

		m.mapToken[user.Token] = user.ID
	}
	return m
}
