package client

import (
	"context"

	"github.com/jauhararifin/graphql"
	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (clt *client) Problems(ctx context.Context) (*ugrade.ProblemListResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, xerrors.Errorf("cannot get session token: %w", err)
	}

	gqlRequest := graphql.NewRequest(`
		query GetProblems {
			problems {
				id shortId name disabled
			}
		}
	`)
	gqlRequest.Header.Add("Authorization", "Bearer "+token)
	var resp struct {
		Problems []ugrade.ProblemListItem
	}
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return nil, xerrors.Errorf("cannot fetch problems from server: %w", err)
	}

	return &ugrade.ProblemListResult{
		Problems: resp.Problems,
	}, nil
}
