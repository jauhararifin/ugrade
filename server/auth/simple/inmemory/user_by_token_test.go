package inmemory

import (
	"context"
	"testing"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func TestUserByToken(t *testing.T) {
	token := "somefaketoken"
	uid := "fakeuserid"
	user := &simple.User{}
	m := &inMemory{
		mapIDUser: map[string]*simple.User{uid: user},
		mapToken:  map[string]string{token: uid},
	}
	ctx := context.Background()
	item, err := m.UserByToken(ctx, token)
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if item != user {
		t.Errorf("Expecting item to be %v, found %v instead", user, item)
	}
}

func TestMissingUserByToken(t *testing.T) {
	m := &inMemory{
		mapContestEmail: make(map[string]string),
	}
	ctx := context.Background()
	user, err := m.UserByToken(ctx, "somerandomtoken")
	if _, ok := err.(*noSuchUser); !ok {
		t.Errorf("Expecting noSuchUser error, found %T", err)
	}
	if user != nil {
		t.Errorf("Expecting user is nil, found %v", user)
	}
}

func TestInvalidStateUserByToken(t *testing.T) {
	m := &inMemory{
		mapIDUser: make(map[string]*simple.User),
		mapToken:  map[string]string{"faketoken": "fakeuid"},
	}
	ctx := context.Background()
	users, err := m.UserByToken(ctx, "faketoken")
	if users != nil {
		t.Errorf("Expecting users to be null, found %v instead", users)
	}
	if err == nil {
		t.Errorf("Expecting error to be invalidState, found nil intead")
	}
	if _, ok := err.(*invalidState); !ok {
		t.Errorf("Expecting error to be invalidState, found %T intead", err)
	}
}
