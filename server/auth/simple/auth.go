package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/otc"
	"github.com/jauhararifin/ugrade/server/uuid"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

// Simple is struct that implement auth.Service
type Simple struct {
	store Store
}

// UserByID returns specific User by its ID. If no such user is found, then returned NoSuchUser.
func (s *Simple) UserByID(userID string) (*auth.User, error) {
	user, err := s.store.UserByID(userID)
	if auth.IsNoSuchUser(err) {
		return nil, err
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch user")
	}
	return user.User, nil
}

// UsersInContest returns all users in a contest. If no such contest is found, then returned NoSuchContest.
func (s *Simple) UsersInContest(contestID string) ([]*auth.User, error) {
	users, err := s.store.UsersInContest(contestID)
	if auth.IsNoSuchContest(err) {
		return nil, err
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch users")
	}
	result := make([]*auth.User, len(users))
	for _, u := range users {
		result = append(result, u.User)
	}
	return result, nil
}

// UserByEmail returns specific user by combination if its contestID and email. When no such user if found, returned ErrNoSuchUser.
func (s *Simple) UserByEmail(contestID, email string) (*auth.User, error) {
	if err := validateEmail(email); err != nil {
		return nil, &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				email: err.Error(),
			},
		}
	}
	user, err := s.store.UserByEmail(contestID, email)
	if auth.IsNoSuchUser(err) {
		return nil, err
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch user")
	}
	return user.User, nil
}

// UserByUsernames returns slices of users by its username in specific contest. When no such contest if found, returned ErrNoSuchContest.
func (s *Simple) UserByUsernames(contestID string, usernames []string) ([]*auth.User, error) {
	users, err := s.store.UserByUsernames(contestID, usernames)
	if auth.IsNoSuchContest(err) {
		return nil, err
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch users")
	}
	result := make([]*auth.User, len(users))
	for _, u := range users {
		result = append(result, u.User)
	}
	return result, nil
}

// SignIn authenticate combination of contestId, email and password and returns session token when success, otherwise return ErrWrongCredential error.
func (s *Simple) SignIn(contestID, email, password string) (string, error) {
	user, err := s.store.UserByEmail(contestID, email)
	if auth.IsNoSuchUser(err) {
		return "", &authErr{
			msg:             "wrong credential",
			wrongCredential: true,
		}
	}
	if err != nil {
		return "", errors.Wrap(err, "cannot fetch user")
	}

	byteDbPass := []byte(user.Password)
	bytePass := []byte(password)
	if err := bcrypt.CompareHashAndPassword(byteDbPass, bytePass); err != nil {
		return "", &authErr{
			msg:             "wrong credential",
			wrongCredential: true,
		}
	}

	if len(user.Token) > 0 {
		return user.Token, nil
	}

	token, err := s.store.IssueToken(user.ID, uuid.Random())
	if err != nil {
		return "", errors.Wrap(err, "cannot issue token")
	}
	return token, nil
}

// SignUp used by used when they first time join the contest. It takes user information such as name, username and passwod and returned session token when success.
func (s *Simple) SignUp(contestID, username, email, oneTimeCode, password, name string) (string, error) {
	errUsername := validateUsername(username)
	errName := validateName(name)
	errPasswd := validatePassword(password)
	if errUsername != nil || errName != nil || errPasswd != nil {
		err := &invalidInputErr{}
		if errUsername != nil {
			err.username = errUsername.Error()
		}
		if errName != nil {
			err.name = errName.Error()
		}
		if errPasswd != nil {
			err.password = errPasswd.Error()
		}
		return "", &authErr{
			msg:          "invalid input",
			invalidInput: err,
		}
	}

	uu, err := s.store.UserByUsernames(contestID, []string{username})
	if auth.IsNoSuchContest(err) {
		return "", err
	}
	if err != nil {
		return "", errors.Wrap(err, "cannot fetch users")
	}
	if len(uu) > 0 {
		return "", &authErr{
			msg:                 "username already used",
			usernameAlreadyUsed: true,
		}
	}

	user, err := s.store.UserByEmail(contestID, email)
	if auth.IsNoSuchUser(err) {
		return "", err
	}
	if err != nil {
		return "", errors.Wrap(err, "cannot fetch user")
	}

	if user.SignedUp {
		return "", &authErr{
			msg:             "already signed up",
			alreadySignedUp: true,
		}
	}

	if len(user.SignUpOTC) == 0 || user.SignUpOTC != oneTimeCode {
		return "", &authErr{
			msg:        "wrong one time code",
			wrongToken: true,
		}
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if errPass != nil {
		return "", errors.Wrap(errPass, "cannot hash password")
	}

	token := uuid.Random()

	updatedUser := copyUser(user)
	updatedUser.Name = name
	updatedUser.Password = string(hashPass)
	updatedUser.Token = token
	updatedUser.SignUpOTC = ""
	updatedUser.ResetPasswordOTC = ""

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return "", errors.Wrap(err, "cannot update user")
	}
	return token, nil
}

// ForgotPassword used by user to send reset password request.
func (s *Simple) ForgotPassword(contestID, email string) error {
	user, err := s.store.UserByEmail(contestID, email)
	if auth.IsNoSuchUser(err) {
		return err
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	updatedUser := copyUser(user)
	updatedUser.ResetPasswordOTC = otc.Random()

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}

// ResetPassword used by user to reset their password.
func (s *Simple) ResetPassword(contestID, email, oneTimeCode, password string) error {
	if err := validatePassword(password); err != nil {
		return &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				password: err.Error(),
			},
		}
	}

	user, err := s.store.UserByEmail(contestID, email)
	if auth.IsNoSuchUser(err) {
		return err
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	if len(user.ResetPasswordOTC) == 0 || user.ResetPasswordOTC != oneTimeCode {
		return &authErr{
			msg:        "wrong one time code",
			wrongToken: true,
		}
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if errPass != nil {
		return errors.Wrap(errPass, "cannot hash password")
	}

	user.Password = string(hashPass)
	user.ResetPasswordOTC = ""
	if err := s.store.Update(user.ID, user); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}

// AddUser invite other users to a contest.
func (s *Simple) AddUser(token string, users map[string][]int) error {
	user, err := s.store.UserByToken(token)
	if auth.IsNoSuchUser(err) {
		return &authErr{
			msg:            "invalid session token",
			invalidSession: true,
		}
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	myPermissions := make(map[int]bool)
	for perm := range user.Permissions {
		myPermissions[perm] = true
	}

	hasPermission := myPermissions[auth.PermissionUsersInvite]
	if !hasPermission {
		return &authErr{
			msg:             "forbidden action",
			forbiddenAction: true,
		}
	}

	canGivePermission := true
	for _, perms := range users {
		for perm := range perms {
			if _, ok := myPermissions[perm]; !ok {
				canGivePermission = false
				break
			}
		}
		if !canGivePermission {
			break
		}
	}
	if !canGivePermission {
		return &authErr{
			msg:             "forbidden action",
			forbiddenAction: true,
		}
	}

	for email := range users {
		exists, err := s.store.EmailExists(user.ContestID, email)
		if err != nil {
			return errors.Wrap(err, "cannot fetch email")
		}
		if exists {
			return &authErr{
				msg:            "already invited",
				alreadyInvited: true,
			}
		}
	}

	newUsers := make([]*User, len(users))
	for email, perms := range users {
		newUsers = append(newUsers, &User{
			User: &auth.User{
				ID:          uuid.Random(),
				ContestID:   user.ContestID,
				Username:    "",
				Email:       email,
				Name:        "",
				Permissions: perms,
				SignedUp:    false,
			},
			Password:         "",
			Token:            "",
			SignUpOTC:        otc.Random(),
			ResetPasswordOTC: "",
		})
	}

	if err := s.store.Insert(newUsers); err != nil {
		return errors.Wrap(err, "cannot insert new user")
	}
	return nil
}

// AddContest add new contest with specific email as admin.
func (s *Simple) AddContest(contestID, adminEmail string) (*User, error) {
	conExists, err := s.store.ContestExists(contestID)
	if err != nil {
		return nil, errors.Wrap(err, "cannot add new contest")
	}
	if conExists {
		return nil, &authErr{
			contestAlreadyExists: true,
		}
	}

	admin := &User{
		User: &auth.User{
			ID:          uuid.Random(),
			Username:    "",
			Email:       adminEmail,
			Name:        "",
			ContestID:   contestID,
			SignedUp:    false,
			Permissions: auth.Permissions,
		},
		Password:         "",
		Token:            "",
		SignUpOTC:        otc.Random(),
		ResetPasswordOTC: "",
	}

	err = s.store.Insert([]*User{admin})
	if err != nil {
		return nil, errors.Wrap(err, "cannot add new contest")
	}

	return admin, nil
}

// Me returns User information based on their's session token.
func (s *Simple) Me(token string) (*auth.User, error) {
	user, err := s.store.UserByToken(token)
	if auth.IsNoSuchUser(err) {
		return nil, &authErr{
			msg:            "invalid session token",
			invalidSession: true,
		}
	}
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch user")
	}
	return user.User, nil
}

// SetMyPassword updates user password.
func (s *Simple) SetMyPassword(token, oldPassword, newPassword string) error {
	errOld := validatePassword(oldPassword)
	errNew := validatePassword(newPassword)
	if errOld != nil || errNew != nil {
		errStr := ""
		if errOld != nil {
			errStr = errOld.Error()
		} else {
			errStr = errNew.Error()
		}
		return &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				password: errStr,
			},
		}
	}

	user, err := s.store.UserByToken(token)
	if auth.IsNoSuchUser(err) {
		return &authErr{
			msg:            "invalid session token",
			invalidSession: true,
		}
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	if oldPassword != user.Password {
		return &authErr{
			msg:             "wrong credential",
			wrongCredential: true,
		}
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.MinCost)
	if errPass != nil {
		return errors.Wrap(err, "cannot hash password")
	}

	updatedUser := copyUser(user)
	updatedUser.Password = string(hashPass)

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}

// SetMyName updates user's name information.
func (s *Simple) SetMyName(token, name string) error {
	if err := validateName(name); err != nil {
		return &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				name: err.Error(),
			},
		}
	}

	user, err := s.store.UserByToken(token)
	if auth.IsNoSuchUser(err) {
		return &authErr{
			msg:            "invalid session token",
			invalidSession: true,
		}
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	updatedUser := copyUser(user)
	updatedUser.Name = name

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}

// SetUserPermissions updates other user's permission list.
func (s *Simple) SetUserPermissions(token, userID string, permissions []int) error {
	if err := validatePermissions(permissions); err != nil {
		return &authErr{
			msg: "invalid input",
			invalidInput: &invalidInputErr{
				permissions: err.Error(),
			},
		}
	}

	user, err := s.store.UserByToken(token)
	if auth.IsNoSuchUser(err) {
		return &authErr{
			msg:            "invalid session token",
			invalidSession: true,
		}
	}
	if err != nil {
		return errors.Wrap(err, "cannot fetch user")
	}

	myPerms := make(map[int]bool)
	for perm := range user.Permissions {
		myPerms[perm] = true
	}

	if _, ok := myPerms[auth.PermissionUsersPermissionsUpdate]; !ok {
		return &authErr{
			msg:             "forbidden action",
			forbiddenAction: true,
		}
	}

	for perm := range permissions {
		if _, ok := myPerms[perm]; !ok {
			return &authErr{
				msg:             "forbidden action",
				forbiddenAction: true,
			}
		}
	}

	updatedUser := copyUser(user)
	updatedUser.Permissions = permissions

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return errors.Wrap(err, "cannot update user")
	}
	return nil
}
