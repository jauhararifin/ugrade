package auth

// ValidationError contains information about validation error.
type ValidationError struct {
	Username string
	Name     string
	Email    string
	Password string
}

// Error interface is the error that returned by auth.Service.
type Error interface {
	error
	IsNoSuchUser() bool
	IsNoSuchContest() bool
	IsWrongCredential() bool
	IsWrongToken() bool
	IsInvalidSession() bool
	IsForbiddenAction() bool
	IsInvalidInput() bool
	IsUsernameAlreadyUsed() bool
	ValidationError() ValidationError
	IsInternal() bool
	IsAlreadyInvited() bool
}

type defaultError struct {
	msg                 string
	noSuchUser          bool
	noSuchContest       bool
	wrongCredential     bool
	wrongToken          bool
	invalidSession      bool
	forbiddenAction     bool
	invalidInput        bool
	usernameAlreadyUsed bool
	internal            bool
	alreadyInvited      bool
	validationError     ValidationError
}

func (d *defaultError) Error() string {
	return d.msg
}

func (d *defaultError) IsNoSuchUser() bool {
	return d.noSuchUser
}

func (d *defaultError) IsNoSuchContest() bool {
	return d.noSuchContest
}

func (d *defaultError) IsWrongCredential() bool {
	return d.wrongCredential
}

func (d *defaultError) IsWrongToken() bool {
	return d.wrongToken
}

func (d *defaultError) IsInvalidSession() bool {
	return d.invalidSession
}

func (d *defaultError) IsForbiddenAction() bool {
	return d.forbiddenAction
}

func (d *defaultError) IsInvalidInput() bool {
	return d.invalidInput
}

func (d *defaultError) ValidationError() ValidationError {
	return d.validationError
}

func (d *defaultError) IsUsernameAlreadyUsed() bool {
	return d.usernameAlreadyUsed
}

func (d *defaultError) IsInternal() bool {
	return d.internal
}

func (d *defaultError) IsAlreadyInvited() bool {
	return d.alreadyInvited
}

// ErrNoSuchUser indicates that no user is found when calling Service methods.
var ErrNoSuchUser = &defaultError{
	msg:        "No Such User",
	noSuchUser: true,
}

// ErrNoSuchContest indicates that no contest is found when calling service methods.
var ErrNoSuchContest = &defaultError{
	msg:           "No Such Contest",
	noSuchContest: true,
}

// ErrWrongCredential indicates that provided credential is wrong when authenticating user.
var ErrWrongCredential = &defaultError{
	msg:             "Wrong Credential",
	wrongCredential: true,
}

// ErrWrongToken indicates that user provided wrong token. oneTimeCode is considered as token too.
var ErrWrongToken = &defaultError{
	msg:        "Wrong Token",
	wrongToken: true,
}

// ErrInvalidSession indicates that user provided invalid session token.
var ErrInvalidSession = &defaultError{
	msg:            "Invalid Session",
	invalidSession: true,
}

// ErrForbiddenAction indicates that user doesn't have permission to do some actions.
var ErrForbiddenAction = &defaultError{
	msg:             "Forbidden Action",
	forbiddenAction: true,
}

// NewInvalidInput returns new Error that indicates validation error.
func NewInvalidInput(validationErr ValidationError) Error {
	return &defaultError{
		msg:             "Invalid Input",
		invalidInput:    true,
		validationError: validationErr,
	}
}

// ErrUsernameAlreadyUsed indicates that user's username input is already used by other user.
var ErrUsernameAlreadyUsed = &defaultError{
	msg:                 "Username Already Used",
	usernameAlreadyUsed: true,
}

// ErrInternalServer indicates that there is internal server error.
var ErrInternalServer = &defaultError{
	msg:      "Internal Server Error",
	internal: true,
}

// ErrAlreadyInvited indicates that users is already invited.
var ErrAlreadyInvited = &defaultError{
	msg:            "User Already Invited",
	alreadyInvited: true,
}
