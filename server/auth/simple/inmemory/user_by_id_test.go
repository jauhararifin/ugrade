package inmemory

import (
	"testing"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func TestUserByID(t *testing.T) {
	user := &simple.User{}
	key := "somerandomstring"
	m := &inMemory{
		mapIDUser: map[string]*simple.User{key: user},
	}
	item, err := m.UserByID(key)
	if err != nil {
		t.Errorf("UserByID returns error: %s", err.Error())
	}
	if item != user {
		t.Errorf("UserByID returns different user")
	}
}

func TestNoSuchUserInUserByID(t *testing.T) {
	m := &inMemory{
		mapIDUser: map[string]*simple.User{
			"nouser": &simple.User{},
		},
	}
	user, err := m.UserByID("somerandomstring")
	if _, ok := err.(*noSuchUser); !ok {
		t.Errorf("Expecting noSuchUser error, found %T", err)
	}
	if user != nil {
		t.Errorf("Expecting user is nil, found %v", user)
	}
}

func TestAssertUserById(t *testing.T) {
	user := &simple.User{}
	key := "somerandomstring"
	m := &inMemory{
		mapIDUser: map[string]*simple.User{key: user},
	}
	item, err := m.assertUserByID(key, "fakeMap")
	if err != nil {
		t.Errorf("assertUserById returns error: %s", err.Error())
	}
	if item != user {
		t.Errorf("assertUserById returns different user")
	}
}

func TestAssertUserByIdFail(t *testing.T) {
	user := &simple.User{}
	key := "somerandomstring"
	m := &inMemory{
		mapIDUser: map[string]*simple.User{key: user},
	}
	item, err := m.assertUserByID("someotherrandomkey", "fakeMap")
	if err == nil {
		t.Error("Expecting error but returned nil")
	}
	if _, ok := err.(*invalidState); !ok {
		t.Error("Expecting invalidState error, found %T", err)
	}
	if item != nil {
		t.Errorf("Expecting nil user, but found %v", item)
	}
}
