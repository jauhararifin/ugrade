package inmemory

import (
	"context"
	"testing"
)

func TestEmailExists(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Errorf("Expecting inMemory, found %T", m)
	}

	m.mapContestEmail["fakecontestid/fakeemail"] = "fakeuid"
	ctx := context.Background()
	r, err := m.EmailExists(ctx, "fakecontestid", "fakeemail")
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

	ctx := context.Background()

	r, err := m.EmailExists(ctx, "fakecontestid", "fakeemail")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if r {
		t.Errorf("Expecting r to be false, found %v instead", r)
	}

	r, err = m.EmailExists(ctx, "someothercontestid", "fakeemail")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if r {
		t.Errorf("Expecting r to be false, found %v instead", r)
	}
}
