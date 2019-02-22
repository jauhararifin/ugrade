package store

import (
	"fmt"
	"math/rand"
)

type inMemoryContest struct {
	userEmail    map[string]string
	userUsername map[string]string
}

type inMemoryAuthStore struct {
	contest   map[string]inMemoryContest
	userUUID  map[string]User
	userToken map[string]string
}

func (m *inMemoryAuthStore) IsContestExists(contestID string) (bool, error) {
	_, ok := m.contest[contestID]
	return ok, nil
}

func (m *inMemoryAuthStore) GetUser(userUUID string) (User, error) {
	if user, ok := m.userUUID[userUUID]; ok {
		return user, nil
	}
	return User{}, ErrNoSuchUser
}

func (m *inMemoryAuthStore) GetUserByEmail(contestID, email string) (User, error) {
	if contest, ok := m.contest[contestID]; ok {
		if uuid, ok := contest.userEmail[email]; ok {
			return m.GetUser(uuid)
		}
		return User{}, ErrNoSuchUser
	}
	return User{}, ErrNoSuchContest
}

func (m *inMemoryAuthStore) GetUserByUsername(contestID, username string) (User, error) {
	if contest, ok := m.contest[contestID]; ok {
		if uuid, ok := contest.userUsername[username]; ok {
			return m.GetUser(uuid)
		}
		return User{}, ErrNoSuchUser
	}
	return User{}, ErrNoSuchContest
}

func (m *inMemoryAuthStore) GetUserByToken(sessionToken string) (User, error) {
	if uuid, ok := m.userToken[sessionToken]; ok {
		return m.GetUser(uuid)
	}
	return User{}, ErrNoSuchUser
}

func (m *inMemoryAuthStore) SetUserForgetPassword(userUUID, token string) error {
	if user, ok := m.userUUID[userUUID]; ok {
		chars := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
		token := make([]rune, 128)
		for i := range token {
			token[i] = chars[rand.Intn(128)]
		}
		user.ForgotToken = fmt.Sprint(token)
		m.userUUID[userUUID] = user
	}
	return ErrNoSuchUser
}
