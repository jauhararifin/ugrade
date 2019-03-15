package simple

import (
	"context"

	"github.com/jauhararifin/ugrade/server/auth"
	"github.com/jauhararifin/ugrade/server/otc"
	"github.com/jauhararifin/ugrade/server/uuid"
	"github.com/pkg/errors"
)

// AddContest add new contest with specific email as admin.
func (s *Simple) AddContest(ctx context.Context, contestID, adminEmail string) (*auth.User, error) {
	conExists, err := s.store.ContestExists(ctx, contestID)
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

	err = s.store.Insert(ctx, []*User{admin})
	if err != nil {
		return nil, errors.Wrap(err, "cannot add new contest")
	}

	return admin.User, nil
}
