package auth

// NoSuchUser indicates indicates that no user is found when calling Service methods.
type NoSuchUser interface {
	NoSuchUser() bool
}

// IsNoSuchUser checks whether error is NoSuchUser
func IsNoSuchUser(err error) bool {
	if m, ok := err.(NoSuchUser); ok {
		return m.NoSuchUser()
	}
	return false
}

// NoSuchContest indicates indicates that no contest is found when calling service methods.
type NoSuchContest interface {
	NoSuchContest() bool
}

// IsNoSuchContest checks whether error is NoSuchContest
func IsNoSuchContest(err error) bool {
	if m, ok := err.(NoSuchContest); ok {
		return m.NoSuchContest()
	}
	return false
}

// WrongCredential indicates indicates that provided credential is wrong when authenticating user.
type WrongCredential interface {
	WrongCredential() bool
}

// IsWrongCredential checks whether error is WrongCredential
func IsWrongCredential(err error) bool {
	if m, ok := err.(WrongCredential); ok {
		return m.WrongCredential()
	}
	return false
}

// WrongToken indicates indicates that user provided wrong token. oneTimeCode is considered as token too.
type WrongToken interface {
	WrongToken() bool
}

// IsWrongToken checks whether error is WrongToken
func IsWrongToken(err error) bool {
	if m, ok := err.(WrongToken); ok {
		return m.WrongToken()
	}
	return false
}

// InvalidSession indicates indicates that user provided invalid session token.
type InvalidSession interface {
	InvalidSession() bool
}

// IsInvalidSession checks whether error is InvalidSession
func IsInvalidSession(err error) bool {
	if m, ok := err.(InvalidSession); ok {
		return m.InvalidSession()
	}
	return false
}

// ForbiddenAction indicates indicates that user doesn't have permission to do some actions.
type ForbiddenAction interface {
	ForbiddenAction() bool
}

// IsForbiddenAction checks whether error is ForbiddenAction
func IsForbiddenAction(err error) bool {
	if m, ok := err.(ForbiddenAction); ok {
		return m.ForbiddenAction()
	}
	return false
}

// InvalidInput indiates that user's input is invalid.
type InvalidInput interface {
	InvalidInput() bool
	Username() string
	Name() string
	Email() string
	Password() string
}

// IsInvalidInput checks whether error is InvalidInput
func IsInvalidInput(err error) bool {
	if m, ok := err.(InvalidInput); ok {
		return m.InvalidInput()
	}
	return false
}

// UsernameAlreadyUsed indicates indicates that user's username input is already used by other user.
type UsernameAlreadyUsed interface {
	UsernameAlreadyUsed() bool
}

// IsUsernameAlreadyUsed checks whether error is UsernameAlreadyUsed
func IsUsernameAlreadyUsed(err error) bool {
	if m, ok := err.(UsernameAlreadyUsed); ok {
		return m.UsernameAlreadyUsed()
	}
	return false
}

// AlreadyInvited indicates indicates that users is already invited.
type AlreadyInvited interface {
	AlreadyInvited() bool
}

// IsAlreadyInvited checks whether error is AlreadyInvited
func IsAlreadyInvited(err error) bool {
	if m, ok := err.(AlreadyInvited); ok {
		return m.AlreadyInvited()
	}
	return false
}
