package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
)

type invalidInputErr struct {
	username    string
	name        string
	email       string
	password    string
	permissions string
}

func (e *invalidInputErr) InvalidInput() bool {
	return true
}

func (e *invalidInputErr) Username() string {
	return e.username
}

func (e *invalidInputErr) Name() string {
	return e.name
}

func (e *invalidInputErr) Email() string {
	return e.email
}

func (e *invalidInputErr) Password() string {
	return e.password
}

func (e *invalidInputErr) Permissions() string {
	return e.permissions
}

type authErr struct {
	msg                  string
	noSuchUser           bool
	noSuchContest        bool
	wrongCredential      bool
	wrongToken           bool
	invalidSession       bool
	forbiddenAction      bool
	invalidInput         *invalidInputErr
	usernameAlreadyUsed  bool
	alreadyInvited       bool
	alreadySignedUp      bool
	contestAlreadyExists bool
}

func (ae *authErr) Error() string {
	return ae.msg
}

func (ae *authErr) NoSuchUser() bool {
	return ae.noSuchUser
}

func (ae *authErr) NoSuchContest() bool {
	return ae.noSuchContest
}

func (ae *authErr) WrongCredential() bool {
	return ae.wrongCredential
}

func (ae *authErr) WrongToken() bool {
	return ae.wrongToken
}

func (ae *authErr) InvalidSession() bool {
	return ae.invalidSession
}

func (ae *authErr) ForbiddenAction() bool {
	return ae.forbiddenAction
}

func (ae *authErr) InvalidInput() (bool, auth.InvalidInput) {
	if ae.invalidInput != nil {
		return true, ae.invalidInput
	}
	return false, nil
}

func (ae *authErr) UsernameAlreadyUsed() bool {
	return ae.usernameAlreadyUsed
}

func (ae *authErr) AlreadyInvited() bool {
	return ae.alreadyInvited
}

func (ae *authErr) AlreadySignedUp() bool {
	return ae.alreadySignedUp
}

func (ae *authErr) ContestAlreadyExists() bool {
	return ae.contestAlreadyExists
}
