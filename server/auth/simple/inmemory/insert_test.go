package inmemory

import (
	"testing"

	"github.com/jauhararifin/ugrade/server/auth"

	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func TestInsert(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	newUser1 := &simple.User{
		User: &auth.User{
			ID:        "uid1",
			Username:  "uname1",
			Email:     "email1",
			Name:      "name1",
			ContestID: "contest1",
		},
		Password:         "pass1",
		Token:            "token1",
		SignUpOTC:        "00000001",
		ResetPasswordOTC: "00000001",
	}

	newUser2 := &simple.User{
		User: &auth.User{
			ID:        "uid2",
			Username:  "uname2",
			Email:     "email2",
			Name:      "name2",
			ContestID: "contest2",
		},
		Password:         "pass2",
		Token:            "token2",
		SignUpOTC:        "00000002",
		ResetPasswordOTC: "00000002",
	}

	err := m.Insert([]*simple.User{newUser1, newUser2})
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}

	if _, ok := m.mapContestUsers["contest1"]; !ok {
		t.Error("Expecting 'contest1' to be exists in mapContestUsers")
	}

	if _, ok := m.mapContestUsers["contest2"]; !ok {
		t.Error("Expecting 'contest2' to be exists in mapContestUsers")
	}

	if len(m.mapContestUsers["contest1"]) != 1 || m.mapContestUsers["contest1"][0] != "uid1" {
		t.Error("Expecting 'contest1' to contain only one entry ['uid1']")
	}

	if len(m.mapContestUsers["contest2"]) != 1 || m.mapContestUsers["contest2"][0] != "uid2" {
		t.Error("Expecting 'contest2' to contain only one entry ['uid2']")
	}

	if _, ok := m.mapIDUser["uid1"]; !ok {
		t.Error("Expecting 'uid1' to be exists in mapIDUser")
	}

	if _, ok := m.mapIDUser["uid2"]; !ok {
		t.Error("Expecting 'uid1' to be exists in mapIDUser")
	}

	if _, ok := m.mapContestEmail["contest1/email1"]; !ok {
		t.Error("Expecting 'contest1/email1' to be exists in mapContestEmail")
	}

	if _, ok := m.mapContestEmail["contest2/email2"]; !ok {
		t.Error("Expecting 'contest2/email2' to be exists in mapContestEmail")
	}

	if _, ok := m.mapContestUsername["contest1/uname1"]; !ok {
		t.Error("Expecting 'contest1/uname1' to be exists in mapContestUsername")
	}

	if _, ok := m.mapContestUsername["contest2/uname2"]; !ok {
		t.Error("Expecting 'contest2/uname2' to be exists in mapContestUsername")
	}

	if _, ok := m.mapToken["token1"]; !ok {
		t.Error("Expecting 'token1' to be exists in mapToken")
	}

	if _, ok := m.mapToken["token2"]; !ok {
		t.Error("Expecting 'token2' to be exists in mapToken")
	}
}

func TestInsertWithDuplicateID(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	m.mapIDUser["somealreadyexistsid"] = &simple.User{}
	newUser := &simple.User{
		User: &auth.User{
			ID:        "somealreadyexistsid",
			Username:  "uname1",
			Email:     "email1",
			Name:      "name1",
			ContestID: "contest1",
		},
		Password:         "pass1",
		Token:            "token1",
		SignUpOTC:        "00000001",
		ResetPasswordOTC: "00000001",
	}

	err := m.Insert([]*simple.User{newUser})
	if err == nil {
		t.Errorf("Expecting error to be defined, nil found")
	}
}

func TestInsertWithDuplicateEmail(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	m.mapContestEmail["contest1/email1"] = "someotherid"
	newUser := &simple.User{
		User: &auth.User{
			ID:        "uid1",
			Username:  "uname1",
			Email:     "email1",
			Name:      "name1",
			ContestID: "contest1",
		},
		Password:         "pass1",
		Token:            "token1",
		SignUpOTC:        "00000001",
		ResetPasswordOTC: "00000001",
	}

	err := m.Insert([]*simple.User{newUser})
	if err == nil {
		t.Errorf("Expecting error to be defined, nil found")
	}
}

func TestInsertWithDuplicateUsername(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	m.mapContestUsername["contest1/uname1"] = "someotherid"
	newUser := &simple.User{
		User: &auth.User{
			ID:        "uid1",
			Username:  "uname1",
			Email:     "email1",
			Name:      "name1",
			ContestID: "contest1",
		},
		Password:         "pass1",
		Token:            "token1",
		SignUpOTC:        "00000001",
		ResetPasswordOTC: "00000001",
	}

	err := m.Insert([]*simple.User{newUser})
	if err == nil {
		t.Errorf("Expecting error to be defined, nil found")
	}
}

func TestInsertWithDuplicateToken(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	m.mapToken["token1"] = "someotherid"
	newUser := &simple.User{
		User: &auth.User{
			ID:        "uid1",
			Username:  "uname1",
			Email:     "email1",
			Name:      "name1",
			ContestID: "contest1",
		},
		Password:         "pass1",
		Token:            "token1",
		SignUpOTC:        "00000001",
		ResetPasswordOTC: "00000001",
	}

	err := m.Insert([]*simple.User{newUser})
	if err == nil {
		t.Errorf("Expecting error to be defined, nil found")
	}
}
