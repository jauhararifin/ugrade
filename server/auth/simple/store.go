package simple

import "github.com/jauhararifin/ugrade/server/auth"

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
	UserByID(userID string) (*User, auth.Error)
	UsersInContest(contestID string) ([]*User, auth.Error)
	UserByEmail(contestID, email string) (*User, auth.Error)
	UserByUsernames(contestID string, usernames []string) ([]*User, auth.Error)
	UserByToken(token string) (*User, auth.Error)
	IssueToken(userID, token string) (string, auth.Error)
	Update(userID string, user *User) auth.Error
	Insert(users []*User) auth.Error
	EmailExists(contestID, email string) (bool, auth.Error)
}
