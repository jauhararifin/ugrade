package inmemory

import (
	"testing"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func TestUserByUsernames(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	user1 := &simple.User{}
	user2 := &simple.User{}
	user3 := &simple.User{}
	m.mapIDUser["fakeuid1"] = user1
	m.mapIDUser["fakeuid2"] = user2
	m.mapIDUser["fakeuid3"] = user3
	m.mapContestUsers["fakecontestid"] = []string{}
	m.mapContestUsername["fakecontestid/fakeusername1"] = "fakeuid1"
	m.mapContestUsername["fakecontestid/fakeusername2"] = "fakeuid2"
	m.mapContestUsername["fakecontestid/fakeusername3"] = "fakeuid3"

	users, err := m.UserByUsernames("fakecontestid", []string{
		"fakeusername1",
		"fakeusername2",
		"fakeusername3",
	})

	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}

	expected := []*simple.User{user1, user2, user3}
	for i := 0; i < 3; i++ {
		if users[i] != expected[i] {
			t.Errorf("Expecting users[%d] to be %v, found %v instead", i, expected[i], users[i])
		}
	}
}

func TestUserByUsernamesMissingUsernames(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	user1 := &simple.User{}
	user2 := &simple.User{}
	user3 := &simple.User{}
	m.mapIDUser["fakeuid1"] = user1
	m.mapIDUser["fakeuid2"] = user2
	m.mapIDUser["fakeuid3"] = user3
	m.mapContestUsers["fakecontestid"] = []string{}
	m.mapContestUsername["fakecontestid/fakeusername1"] = "fakeuid1"
	m.mapContestUsername["fakecontestid/fakeusername2"] = "fakeuid2"
	m.mapContestUsername["fakecontestid/fakeusername3"] = "fakeuid3"

	users, err := m.UserByUsernames("fakecontestid", []string{
		"fakeusername1",
		"fakeusername4",
		"fakeusername2",
		"fakeusername5",
		"fakeusername3",
	})

	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}

	expected := []*simple.User{user1, user2, user3}
	for i := 0; i < 3; i++ {
		if users[i] != expected[i] {
			t.Errorf("Expecting users[%d] to be %v, found %v instead", i, expected[i], users[i])
		}
	}
}

func TestUserByUsernamesEmptyUsernames(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	user1 := &simple.User{}
	user2 := &simple.User{}
	user3 := &simple.User{}
	m.mapIDUser["fakeuid1"] = user1
	m.mapIDUser["fakeuid2"] = user2
	m.mapIDUser["fakeuid3"] = user3
	m.mapContestUsers["fakecontestid"] = []string{}
	m.mapContestUsername["fakecontestid/fakeusername1"] = "fakeuid1"
	m.mapContestUsername["fakecontestid/fakeusername2"] = "fakeuid2"
	m.mapContestUsername["fakecontestid/fakeusername3"] = "fakeuid3"

	users, err := m.UserByUsernames("fakecontestid", []string{})

	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}

	if len(users) > 0 {
		t.Errorf("Expecting users to be empty, found %v instead", users)
	}
}

func TestUserByUsernamesMissingContest(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	user1 := &simple.User{}
	m.mapIDUser["fakeuid1"] = user1
	m.mapContestUsername["fakecontestid/fakeusername1"] = "fakeuid1"

	users, err := m.UserByUsernames("fakecontestid", []string{"fakeusername1"})

	if err == nil {
		t.Errorf("Expecting error to be noSuchContest, found %T instead", err)
	}

	if _, ok := err.(*noSuchContest); !ok {
		t.Errorf("Expecting error to be noSuchContest, found %T instead", err)
	}

	if len(users) > 0 {
		t.Errorf("Expecting users to be empty, found %v instead", users)
	}
}

func TestUserByUsernamesInvalidState(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	m.mapContestUsers["fakecontestid"] = []string{}
	m.mapContestUsername["fakecontestid/fakeusername1"] = "fakeuid1"

	users, err := m.UserByUsernames("fakecontestid", []string{"fakeusername1"})

	if err == nil {
		t.Errorf("Expecting error to be invalidState, found %T instead", err)
	}

	if _, ok := err.(*invalidState); !ok {
		t.Errorf("Expecting error to be invalidState, found %T instead", err)
	}

	if len(users) > 0 {
		t.Errorf("Expecting users to be empty, found %v instead", users)
	}
}
