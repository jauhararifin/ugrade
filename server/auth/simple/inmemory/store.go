package inmemory

import (
	"fmt"

	"github.com/jauhararifin/ugrade/server/auth/simple"
	"github.com/pkg/errors"
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

func (m *inMemory) IssueToken(userID, token string) (string, error) {
	user, err := m.UserByID(userID)
	if err != nil {
		if _, ok := err.(*noSuchUser); ok {
			return "", &noSuchUser{}
		}
		return "", errors.Wrap(err, "cannot store issued token")
	}

	if len(user.Token) > 0 {
		return user.Token, nil
	}

	user.Token = token
	return user.Token, nil
}

func (m *inMemory) Update(userID string, newUser *simple.User) error {
	user, err := m.UserByID(userID)
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
			if uid == user.ContestID {
				m.mapContestUsers[user.ContestID] = append(oldContestMap[:i], oldContestMap[i+1:]...)
				break
			}
		}

		newContestMap := m.mapContestUsers[newUser.ContestID]
		newContestMap = append(newContestMap, newUser.ID)
	}

	oldEmailKey := fmt.Sprintf("%s/%s", user.ContestID, user.Email)
	newEmailKey := fmt.Sprintf("%s/%s", user.ContestID, newUser.Email)
	delete(m.mapContestEmail, oldEmailKey)
	m.mapContestEmail[newEmailKey] = newUser.ID

	oldUsernameKey := fmt.Sprintf("%s/%s", user.ContestID, user.Username)
	newUsernameKey := fmt.Sprintf("%s/%s", user.ContestID, newUser.Username)
	delete(m.mapContestUsername, oldUsernameKey)
	m.mapContestUsername[newUsernameKey] = newUser.ID

	delete(m.mapToken, user.Token)
	m.mapToken[newUser.Token] = newUser.ID

	return nil
}

func (m *inMemory) Insert(users []*simple.User) error {
	for _, user := range users {
		if _, ok := m.mapIDUser[user.ID]; ok {
			return errors.Errorf("user with id %s already defined", user.ID)
		}

		if _, ok := m.mapContestUsers[user.ContestID]; !ok {
			return &noSuchContest{}
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

func (m *inMemory) EmailExists(contestID, email string) (bool, error) {
	emailKey := fmt.Sprintf("%s/%s", contestID, email)
	_, ok := m.mapContestEmail[emailKey]
	return ok, nil
}
