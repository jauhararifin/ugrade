package simple

import "github.com/jauhararifin/ugrade/server/auth"

type NoSuchUser = auth.NoSuchUser
type NoSuchContes = auth.NoSuchContest

// User wrap auth.User struct and add password & token field.
type User struct {
	*auth.User
	Password         string
	Token            string
	SignUpOTC        string
	ResetPasswordOTC string
}

// Store is the interface that wraps functionality of storing information that used by Service.
type Store interface {
	UserByID(userID string) (*User, error)
	UsersInContest(contestID string) ([]*User, error)
	UserByEmail(contestID, email string) (*User, error)
	UserByUsernames(contestID string, usernames []string) ([]*User, error)
	UserByToken(token string) (*User, error)
	IssueToken(userID, token string) (string, error)
	Update(userID string, user *User) error
	Insert(users []*User) error
	EmailExists(contestID, email string) (bool, error)
}
