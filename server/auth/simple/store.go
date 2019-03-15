package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
)

// NoSuchUser indicates that no user is found.
type NoSuchUser = auth.NoSuchUser

// NoSuchContest indicates that no contest is found.
type NoSuchContest = auth.NoSuchContest

// IsNoSuchUser checks whether the error is NoSuchUser.
func IsNoSuchUser(err error) bool {
	return auth.IsNoSuchUser(err)
}

// IsNoSuchContest checks whether the error is NoSuchContest.
func IsNoSuchContest(err error) bool {
	return auth.IsNoSuchContest(err)
}

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
	UserByID(ctx context.Context, userID string) (*User, error)
	UsersInContest(ctx context.Context, contestID string) ([]*User, error)
	UserByEmail(ctx context.Context, contestID, email string) (*User, error)
	UserByUsernames(ctx context.Context, contestID string, usernames []string) ([]*User, error)
	UserByToken(ctx context.Context, token string) (*User, error)
	IssueToken(ctx context.Context, userID, token string) (string, error)
	Update(ctx context.Context, userID string, user *User) error
	Insert(ctx context.Context, users []*User) error
	EmailExists(ctx context.Context, contestID, email string) (bool, error)
	ContestExists(ctx context.Context, contestID string) (bool, error)
}
