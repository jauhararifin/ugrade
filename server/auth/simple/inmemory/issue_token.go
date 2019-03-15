package inmemory

import (
	"context"

	"github.com/pkg/errors"
)

func (m *inMemory) IssueToken(ctx context.Context, userID, token string) (string, error) {
	user, err := m.UserByID(ctx, userID)
	if err != nil {
		if _, ok := err.(*noSuchUser); ok {
			return "", &noSuchUser{}
		}
		return "", errors.Wrap(err, "cannot store issued token")
	}

	if len(user.Token) > 0 {
		return user.Token, nil
	}

	user.Token = token
	m.mapToken[user.Token] = user.ID
	return user.Token, nil
}
