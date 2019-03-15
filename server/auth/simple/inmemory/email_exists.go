package inmemory

import (
	"context"
	"fmt"
)

func (m *inMemory) EmailExists(_ context.Context, contestID, email string) (bool, error) {
	emailKey := fmt.Sprintf("%s/%s", contestID, email)
	_, ok := m.mapContestEmail[emailKey]
	return ok, nil
}
