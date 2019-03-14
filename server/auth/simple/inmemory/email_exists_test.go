package inmemory

import "testing"

func TestEmailExists(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Errorf("Expecting inMemory, found %T", m)
	}

	m.mapContestEmail["fakecontestid/fakeemail"] = "fakeuid"
	r, err := m.EmailExists("fakecontestid", "fakeemail")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if !r {
		t.Errorf("Expecting r to be true, found %v instead", r)
	}
}

func TestMissingEmail(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Errorf("Expecting inMemory, found %T", m)
	}

	m.mapContestEmail["fakecontestid/nonemail"] = "nonuid"

	r, err := m.EmailExists("fakecontestid", "fakeemail")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if r {
		t.Errorf("Expecting r to be false, found %v instead", r)
	}

	r, err = m.EmailExists("someothercontestid", "fakeemail")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if r {
		t.Errorf("Expecting r to be false, found %v instead", r)
	}
}
