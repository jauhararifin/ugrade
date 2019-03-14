package inmemory

import "testing"

func TestContestExists(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Errorf("Expecting inMemory, found %T", m)
	}

	m.mapContestUsers["fakecontestid"] = nil
	r, err := m.ContestExists("fakecontestid")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if !r {
		t.Errorf("Expecting r to be true, found %v instead", r)
	}
}

func TestMissingContest(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Errorf("Expecting inMemory, found %T", m)
	}

	m.mapContestUsers["fakecontestid"] = nil

	r, err := m.ContestExists("otherfakecontestid")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if r {
		t.Errorf("Expecting r to be false, found %v instead", r)
	}
}
