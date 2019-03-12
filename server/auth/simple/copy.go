package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
)

func copyUser(user *User) *User {
	newPermissions := make([]int, len(user.Permissions))
	copy(newPermissions, user.Permissions)
	return &User{
		User: &auth.User{
			ID:          user.ID,
			ContestID:   user.ContestID,
			Username:    user.Username,
			Email:       user.Email,
			Name:        user.Name,
			Permissions: newPermissions,
		},
		Password:         user.Password,
		Token:            user.Token,
		SignUpOTC:        user.SignUpOTC,
		ResetPasswordOTC: user.ResetPasswordOTC,
	}
}
