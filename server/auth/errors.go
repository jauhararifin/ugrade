package auth

type errorString struct {
	msg string
}

func (e *errorString) Error() string {
	return e.msg
}

// NoSuchUserError indicates indicates that no user is found when calling Service methods.
type NoSuchUserError struct {
	errorString
}

// NoSuchContestError indicates indicates that no contest is found when calling service methods.
type NoSuchContestError struct {
	errorString
}

// WrongCredentialError indicates indicates that provided credential is wrong when authenticating user.
type WrongCredentialError struct {
	errorString
}

// WrongTokenError indicates indicates that user provided wrong token. oneTimeCode is considered as token too.
type WrongTokenError struct {
	errorString
}

// InvalidSessionError indicates indicates that user provided invalid session token.
type InvalidSessionError struct {
	errorString
}

// ForbiddenActionError indicates indicates that user doesn't have permission to do some actions.
type ForbiddenActionError struct {
	errorString
}

// InvalidInputError indiates that user's input is invalid.
type InvalidInputError struct {
	errorString
	Username string
	Name     string
	Email    string
	Password string
}

// UsernameAlreadyUsedError indicates indicates that user's username input is already used by other user.
type UsernameAlreadyUsedError struct {
	errorString
}

// InternalServerError indicates indicates that there is internal server error.
type InternalServerError struct {
	errorString
}

// AlreadyInvitedError indicates indicates that users is already invited.
type AlreadyInvitedError struct {
	errorString
}
