package inmemory

import (
	"fmt"
	"testing"

	"github.com/jauhararifin/ugrade/server/auth"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func TestUserByEmail(t *testing.T) {
	uem := "fakeuserid@email.id"
	cid := "fakecontestid"
	uid := "fakeuserid"
	user := &simple.User{User: &auth.User{ID: uid}}
	key := fmt.Sprintf("%s/%s", cid, uem)
	m := &inMemory{
		mapIDUser:       map[string]*simple.User{uid: user},
		mapContestEmail: map[string]string{key: user.ID},
	}
	item, err := m.UserByEmail(cid, uem)
	if err != nil {
		t.Errorf("UserByEmail returns error: %s", err.Error())
	}
	if item != user {
		t.Errorf("UserByEmail returns different user")
	}
}

func TestMissingUserByEmail(t *testing.T) {
	m := &inMemory{
		mapContestEmail: make(map[string]string),
	}
	user, err := m.UserByEmail("somerandomcontest", "somerandomemail")
	if _, ok := err.(*noSuchUser); !ok {
		t.Errorf("Expecting noSuchUser error, found %T", err)
	}
	if user != nil {
		t.Errorf("Expecting user is nil, found %v", user)
	}
}

func TestInvalidStateUserByEmail(t *testing.T) {
	m := &inMemory{
		mapIDUser:       make(map[string]*simple.User),
		mapContestEmail: map[string]string{"fakecontestid/fakeemail": "fakeuid"},
	}
	users, err := m.UserByEmail("fakecontestid", "fakeemail")
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
