package auth

// Service is the interface that wraps authentication functionality in UGrade.
type Service interface {
	// UserByID returns specific User by its ID. If no such user is found, then returned ErrNoSuchUser.
	UserByID(userID string) (*User, Error)

	// UsersInContest returns all users in a contest. If no such contest is found, then returned ErrNoSuchContest.
	UsersInContest(contestID string) ([]*User, Error)

	// UserByEmail returns specific user by combination if its contestID and email. When no such user if found, returned ErrNoSuchUser.
	UserByEmail(contestID, email string) (*User, Error)

	// UserByUsernames returns slices of users by its username in specific contest. When no such contest if found, returned ErrNoSuchContest.
	UserByUsernames(contestID string, usernames []string) ([]*User, Error)

	// SignIn authenticate combination of contestId, email and password and returns session token when success, otherwise return ErrWrongCredential Error.
	SignIn(contestID, email, password string) (string, Error)

	// SignUp used by used when they first time join the contest. It takes user information such as name, username and passwod and returned session token when success.
	SignUp(contestID, username, email, oneTimeCode, password, name string) (string, Error)

	// ForgotPassword used by user to send reset password request.
	ForgotPassword(contestID, email string) Error

	// ResetPasswowrd used by user to reset their password.
	ResetPassword(contestID, email, oneTimeCode, password string) Error

	// AddUser invite other users to a contest.
	AddUser(token string, users map[string][]int) Error

	// Me returns User information based on their's session token.
	Me(token string) (*User, Error)

	// SetMyPassword updates user password.
	SetMyPassword(token, oldPassword, newPassword string) Error

	// SetMyName updates user's name information.
	SetMyName(token, name string) Error

	// SetUserPermission updates other user's permission list.
	SetUserPermissions(token, userID string, permissions []int) Error
}
