package auth

import "context"

// Service is the interface that wraps authentication functionality in UGrade.
type Service interface {
	// UserByID returns specific User by its ID. If no such user is found, then returned ErrNoSuchUser.
	UserByID(ctx context.Context, userID string) (*User, error)

	// UsersInContest returns all users in a contest. If no such contest is found, then returned ErrNoSuchContest.
	UsersInContest(ctx context.Context, contestID string) ([]*User, error)

	// UserByEmail returns specific user by combination if its contestID and email. When no such user if found, returned ErrNoSuchUser.
	UserByEmail(ctx context.Context, contestID, email string) (*User, error)

	// UserByUsernames returns slices of users by its username in specific contest. When no such contest if found, returned ErrNoSuchContest.
	UserByUsernames(ctx context.Context, contestID string, usernames []string) ([]*User, error)

	// SignIn authenticate combination of contestId, email and password and returns session token when success, otherwise return ErrWrongCredential error.
	SignIn(ctx context.Context, contestID, email, password string) (string, error)

	// SignUp used by used when they first time join the contest. It takes user information such as name, username and passwod and returned session token when success.
	SignUp(ctx context.Context, contestID, username, email, oneTimeCode, password, name string) (string, error)

	// ForgotPassword used by user to send reset password request.
	ForgotPassword(ctx context.Context, contestID, email string) error

	// ResetPasswowrd used by user to reset their password.
	ResetPassword(ctx context.Context, contestID, email, oneTimeCode, password string) error

	// AddUser invite other users to a contest.
	AddUser(ctx context.Context, token string, users map[string][]int) error

	// AddContest add new contest with specific email as admin.
	AddContest(ctx context.Context, contestID, adminEmail string) (*User, error)

	// Me returns User information based on their's session token.
	Me(ctx context.Context, token string) (*User, error)

	// SetMyPassword updates user password.
	SetMyPassword(ctx context.Context, token, oldPassword, newPassword string) error

	// SetMyName updates user's name information.
	SetMyName(ctx context.Context, token, name string) error

	// SetUserPermission updates other user's permission list.
	SetUserPermissions(ctx context.Context, token, userID string, permissions []int) error
}
