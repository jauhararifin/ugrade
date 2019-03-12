package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/otc"
	"github.com/jauhararifin/ugrade/server/uuid"
	"golang.org/x/crypto/bcrypt"
)

// Simple is struct that implement auth.Service
type Simple struct {
	store Store
}

// UserByID returns specific User by its ID. If no such user is found, then returned ErrNoSuchUser.
func (s *Simple) UserByID(userID string) (*auth.User, auth.Error) {
	user, err := s.store.UserByID(userID)
	if err != nil {
		return nil, err
	}
	return user.User, nil
}

// UsersInContest returns all users in a contest. If no such contest is found, then returned ErrNoSuchContest.
func (s *Simple) UsersInContest(contestID string) ([]*auth.User, auth.Error) {
	users, err := s.store.UsersInContest(contestID)
	if err != nil {
		return nil, err
	}
	result := make([]*auth.User, len(users))
	for _, u := range users {
		result = append(result, u.User)
	}
	return result, nil
}

// UserByEmail returns specific user by combination if its contestID and email. When no such user if found, returned ErrNoSuchUser.
func (s *Simple) UserByEmail(contestID, email string) (*auth.User, auth.Error) {
	user, err := s.store.UserByEmail(contestID, email)
	if err != nil {
		return nil, err
	}
	return user.User, nil
}

// UserByUsernames returns slices of users by its username in specific contest. When no such contest if found, returned ErrNoSuchContest.
func (s *Simple) UserByUsernames(contestID string, usernames []string) ([]*auth.User, auth.Error) {
	users, err := s.store.UserByUsernames(contestID, usernames)
	if err != nil {
		return nil, err
	}
	result := make([]*auth.User, len(users))
	for _, u := range users {
		result = append(result, u.User)
	}
	return result, nil
}

// SignIn authenticate combination of contestId, email and password and returns session token when success, otherwise return ErrWrongCredential auth.Error.
func (s *Simple) SignIn(contestID, email, password string) (string, auth.Error) {
	user, err := s.store.UserByEmail(contestID, email)
	if err != nil {
		return "", err
	}

	byteDbPass := []byte(user.Password)
	bytePass := []byte(password)
	if err := bcrypt.CompareHashAndPassword(byteDbPass, bytePass); err != nil {
		return "", auth.ErrWrongCredential
	}

	if len(user.Token) > 0 {
		return user.Token, nil
	}

	token, err := s.store.IssueToken(user.ID, uuid.Random())
	if err != nil {
		return "", err
	}
	return token, nil
}

// SignUp used by used when they first time join the contest. It takes user information such as name, username and passwod and returned session token when success.
func (s *Simple) SignUp(contestID, username, email, oneTimeCode, password, name string) (string, auth.Error) {
	if err := validateUsername(username); err != nil {
		return "", auth.NewInvalidInput(auth.ValidationError{
			Username: err.Error(),
		})
	}
	if err := validateName(name); err != nil {
		return "", auth.NewInvalidInput(auth.ValidationError{
			Name: err.Error(),
		})
	}
	if err := validatePassword(password); err != nil {
		return "", auth.NewInvalidInput(auth.ValidationError{
			Password: err.Error(),
		})
	}

	uu, err := s.store.UserByUsernames(contestID, []string{username})
	if err != nil {
		return "", err
	}
	if len(uu) > 0 {
		return "", auth.ErrUsernameAlreadyUsed
	}

	user, err := s.store.UserByEmail(contestID, email)
	if err != nil {
		return "", err
	}
	if len(user.SignUpOTC) == 0 || user.SignUpOTC != oneTimeCode {
		return "", auth.ErrWrongToken
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if errPass != nil {
		return "", auth.ErrInternalServer
	}

	token := uuid.Random()

	updatedUser := copyUser(user)
	updatedUser.Name = name
	updatedUser.Password = string(hashPass)
	updatedUser.Token = token
	updatedUser.SignUpOTC = ""
	updatedUser.ResetPasswordOTC = ""

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return "", err
	}
	return token, nil
}

// ForgotPassword used by user to send reset password request.
func (s *Simple) ForgotPassword(contestID, email string) auth.Error {
	user, err := s.store.UserByEmail(contestID, email)
	if err != nil {
		return err
	}

	updatedUser := copyUser(user)
	updatedUser.ResetPasswordOTC = otc.Random()

	if err := s.store.Update(user.ID, updatedUser); err != nil {
		return err
	}
	return nil
}

// ResetPassword used by user to reset their password.
func (s *Simple) ResetPassword(contestID, email, oneTimeCode, password string) auth.Error {
	if err := validatePassword(password); err != nil {
		return auth.NewInvalidInput(auth.ValidationError{
			Password: err.Error(),
		})
	}
	user, err := s.store.UserByEmail(contestID, email)
	if err != nil {
		return err
	}

	if len(user.ResetPasswordOTC) == 0 || user.ResetPasswordOTC != oneTimeCode {
		return auth.ErrWrongToken
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
	if errPass != nil {
		return auth.ErrInternalServer
	}

	user.Password = string(hashPass)
	user.ResetPasswordOTC = ""
	return s.store.Update(user.ID, user)
}

// AddUser invite other users to a contest.
func (s *Simple) AddUser(token string, users map[string][]int) auth.Error {
	user, err := s.store.UserByToken(token)
	if err != nil {
		return err
	}

	myPermissions := make(map[int]bool)
	for perm := range user.Permissions {
		myPermissions[perm] = true
	}

	hasPermission := myPermissions[auth.UserPermissionUsersInvite]
	if !hasPermission {
		return auth.ErrForbiddenAction
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
		return auth.ErrForbiddenAction
	}

	for email := range users {
		exists, err := s.store.EmailExists(user.ContestID, email)
		if err != nil {
			return err
		}
		if exists {
			return auth.ErrAlreadyInvited
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
			},
			Password:         "",
			Token:            "",
			SignUpOTC:        otc.Random(),
			ResetPasswordOTC: "",
		})
	}

	return s.store.Insert(newUsers)
}

// Me returns User information based on their's session token.
func (s *Simple) Me(token string) (*auth.User, auth.Error) {
	user, err := s.store.UserByToken(token)
	if err != nil {
		return nil, err
	}
	return user.User, nil
}

// SetMyPassword updates user password.
func (s *Simple) SetMyPassword(token, oldPassword, newPassword string) auth.Error {
	user, err := s.store.UserByToken(token)
	if err != nil {
		return err
	}

	if oldPassword != user.Password {
		return auth.ErrWrongCredential
	}

	hashPass, errPass := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.MinCost)
	if errPass != nil {
		return auth.ErrInternalServer
	}

	updatedUser := copyUser(user)
	updatedUser.Password = string(hashPass)

	return s.store.Update(user.ID, updatedUser)
}

// SetMyName updates user's name information.
func (s *Simple) SetMyName(token, name string) auth.Error {
	user, err := s.store.UserByToken(token)
	if err != nil {
		return err
	}

	updatedUser := copyUser(user)
	updatedUser.Name = name

	return s.store.Update(user.ID, updatedUser)
}

// SetUserPermissions updates other user's permission list.
func (s *Simple) SetUserPermissions(token, userID string, permissions []int) auth.Error {
	user, err := s.store.UserByToken(token)
	if err != nil {
		return err
	}

	myPerms := make(map[int]bool)
	for perm := range user.Permissions {
		myPerms[perm] = true
	}

	if _, ok := myPerms[auth.UserPermissionUsersPermissionsUpdate]; !ok {
		return auth.ErrForbiddenAction
	}

	for perm := range permissions {
		if _, ok := myPerms[perm]; !ok {
			return auth.ErrForbiddenAction
		}
	}

	updatedUser := copyUser(user)
	updatedUser.Permissions = permissions

	return s.store.Update(user.ID, updatedUser)
}
