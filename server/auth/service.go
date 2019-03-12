package auth

// Service is the interface that wraps authentication functionality in UGrade.
type Service interface {
	// UserById returns specific User by its ID. If no such user is found, then returned ErrNoSuchUser.
	UserById(userID string) (*User, error)

	// UsersInContest returns all users in a contest. If no such contest is found, then returned ErrNoSuchContest.
	UsersInContest(contestID string) ([]*User, error)

	// UserByEmail returns specific user by combination if its contestID and email. When no such user if found, returned ErrNoSuchUser.
	UserByEmail(contestID, email string) (*User, error)

	// UserByUsernames returns slices of users by its username in specific contest. When no such contest if found, returned ErrNoSuchContest.
	UserByUsernames(contestID string, usernames []string) ([]*User, error)

	// SignIn authenticate combination of contestId, email and password and returns session token when success, otherwise return ErrWrongCredential error.
	SignIn(contestID, email, password string) (string, error)

	// SignUp used by used when they first time join the contest. It takes user information such as name, username and passwod and returned session token when success.
	SignUp(contestID, username, email, oneTimeCode, password, name string) (string, error)

	// ForgotPassword used by user to send reset password request.
	ForgotPassword(contestID, email string) error

	// ResetPasswowrd used by user to reset their password.
	ResetPassword(contestID, email, oneTimeCode, password string) error

	// AddUser invite other users to a contest.
	AddUser(token string, users map[string][]string) ([]string, error)

	// Me returns User information based on their's session token.
	Me(token string) (*User, error)

	// SetMyPassword updates user password.
	SetMyPassword(token, oldPassword, newPassword string) error

	// SetMyName updates user's name information.
	SetMyName(token, name string) error

	// SetUserPermission updates other user's permission list.
	SetUserPermissions(token, userID string, permissions []string) ([]string, error)
}
