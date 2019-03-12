package auth

import "errors"

// ErrNoSuchUser indicates that no user is found when calling Service methods.
var ErrNoSuchUser = errors.New("No Such User")

// ErrNoSuchContest indicates that no contest is found when calling service methods.
var ErrNoSuchContest = errors.New("No Such Contest")

// ErrWrongCredential indicates that provided credential is wrong when authenticating user.
var ErrWrongCredential = errors.New("Wrong Credential")

// ErrWrongToken indicates that user provided wrong token. oneTimeCode is considered as token too.
var ErrWrongToken = errors.New("Wrong Token")

// ErrInvalidSession indicates that user provided invalid session token.
var ErrInvalidSession = errors.New("Invalid Session")

// ErrForbiddenAction indicates that user doesn't have permission to do some actions.
var ErrForbiddenAction = errors.New("Forbidden Action")
