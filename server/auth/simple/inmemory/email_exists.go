package inmemory

import "fmt"

func (m *inMemory) EmailExists(contestID, email string) (bool, error) {
	emailKey := fmt.Sprintf("%s/%s", contestID, email)
	_, ok := m.mapContestEmail[emailKey]
	return ok, nil
}
