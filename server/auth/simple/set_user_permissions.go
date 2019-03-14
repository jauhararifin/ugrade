package simple

import (
	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/pkg/errors"
)

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
