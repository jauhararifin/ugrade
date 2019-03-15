package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/otc"
	"github.com/jauhararifin/ugrade/server/uuid"
	"github.com/pkg/errors"
)

// AddUser invite other users to a contest.
func (s *Simple) AddUser(ctx context.Context, token string, users map[string][]int) error {
	user, err := s.store.UserByToken(ctx, token)
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
		exists, err := s.store.EmailExists(ctx, user.ContestID, email)
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

	if err := s.store.Insert(ctx, newUsers); err != nil {
		return errors.Wrap(err, "cannot insert new user")
	}
	return nil
}
