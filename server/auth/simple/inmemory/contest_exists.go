package inmemory

import "context"

func (m *inMemory) ContestExists(_ context.Context, contestID string) (bool, error) {
	_, ok := m.mapContestUsers[contestID]
	return ok, nil
}
