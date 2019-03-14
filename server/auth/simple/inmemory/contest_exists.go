package inmemory

func (m *inMemory) ContestExists(contestID string) (bool, error) {
	_, ok := m.mapContestUsers[contestID]
	return ok, nil
}
