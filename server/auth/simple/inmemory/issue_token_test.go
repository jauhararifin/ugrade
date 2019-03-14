package inmemory

import (
	"testing"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/auth/simple"
)

func TestIssueToken(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	user := &simple.User{User: &auth.User{ID: "fakeuserid"}}
	m.mapIDUser["fakeuserid"] = user

	token, err := m.IssueToken("fakeuserid", "faketoken")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if token != "faketoken" {
		t.Errorf("Expecting returned token equals 'faketoken', found %s instead", token)
	}
	if m.mapToken["faketoken"] != "fakeuserid" {
		t.Error("Expecting faketoken mapped into fakeuserid")
	}
}

func TestTokenAlreadyIssued(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	user := &simple.User{User: &auth.User{ID: "fakeuserid"}, Token: "longtoken"}
	m.mapToken["longtoken"] = "fakeuserid"
	m.mapIDUser["fakeuserid"] = user

	token, err := m.IssueToken("fakeuserid", "faketoken")
	if err != nil {
		t.Errorf("Expecting error to be nil, found %T instead", err)
	}
	if token != "longtoken" {
		t.Errorf("Expecting returned token equals 'longtoken', found %s instead", token)
	}
	if m.mapToken["longtoken"] != "fakeuserid" {
		t.Error("Expecting longtoken mapped into fakeuserid")
	}
}

func TestNoUserWithToken(t *testing.T) {
	m, ok := New().(*inMemory)
	if !ok {
		t.Error("New should return inMemory store")
	}

	user := &simple.User{User: &auth.User{ID: "fakeuserid"}, Token: "longtoken"}
	m.mapToken["longtoken"] = "fakeuserid"
	m.mapIDUser["fakeuserid"] = user

	token, err := m.IssueToken("nothing", "faketoken")
	if _, ok := err.(*noSuchUser); !ok {
		t.Errorf("Expecting error is noSuchUser, found %T instead", err)
	}
	if len(token) > 0 {
		t.Error("Expecting token to have zero length")
	}
}
