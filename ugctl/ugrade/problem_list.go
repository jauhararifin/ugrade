package ugrade

import (
	"context"

	"github.com/jauhararifin/graphql"
	"github.com/pkg/errors"
)

// ProblemListItem represent single problem when running `problem ls` command.
type ProblemListItem struct {
	ID       string
	ShortID  string
	Name     string
	Disabled bool
}

// ProblemListResult represent result of calling `problem ls` command.
type ProblemListResult struct {
	Problems []ProblemListItem
}

func (clt *client) ProblemList(ctx context.Context) (*ProblemListResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, errors.Wrap(err, "cannot get session token")
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
		Problems []ProblemListItem
	}
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch problems from server")
	}

	return &ProblemListResult{
		Problems: resp.Problems,
	}, nil
}
