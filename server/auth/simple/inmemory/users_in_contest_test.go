package inmemory

import (
	"testing"

	"github.com/jauhararifin/ugrade/server/auth"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func TestUsersInContest(t *testing.T) {
	user1 := &simple.User{
		User: &auth.User{
			ID:        "userone",
			ContestID: "contestid",
		},
	}
	user2 := &simple.User{
		User: &auth.User{
			ID:        "usertwo",
			ContestID: "contestid",
		},
	}
	m := &inMemory{
		mapIDUser:       map[string]*simple.User{user1.ID: user1, user2.ID: user2},
		mapContestUsers: map[string][]string{"contestid": []string{"userone", "usertwo"}},
	}
	users, err := m.UsersInContest("contestid")
	if err != nil {
		t.Errorf("Expecting no error, found %s", err.Error())
	}
	if len(users) != 2 {
		t.Errorf("Expecting returns 2 users, found %d instead", len(users))
	}
	if user1 != users[0] && user1 != users[1] {
		t.Error("Expecting users contain user1")
	}
	if user2 != users[0] && user2 != users[1] {
		t.Error("Expecting users contain user2")
	}
}
