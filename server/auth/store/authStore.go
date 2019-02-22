package store

import "fmt"

// ErrNoSuchContest ...
var ErrNoSuchContest = fmt.Errorf("No Such Contest")

// ErrNoSuchUser ...
var ErrNoSuchUser = fmt.Errorf("No Such User")

// User ...
type User struct {
	UUID        string
	ContestID   string
	Email       string
	Username    string
	Password    string
	ForgotToken string
}

// AuthStore ...
type AuthStore interface {
	IsContestExists(contestID string) (bool, error)
	GetUser(userUUID string) (User, error)
	GetUserByEmail(contestID, email string) (User, error)
	GetUserByUsername(contestID, username string) (User, error)
	GetUserByToken(sessionToken string) (User, error)
	SetUserForgetPassword(userUUID, token string) error
}
