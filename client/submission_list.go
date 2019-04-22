package client

import (
	"context"

	"github.com/jauhararifin/graphql"
	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (clt *client) Submissions(ctx context.Context) (*ugrade.SubmissionListResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, xerrors.Errorf("cannot get session token: %w", err)
	}

	gqlRequest := graphql.NewRequest(`
		query GetSubmissions {
			submissions {
				id problem { name } language { name } issuer { name } issuedTime verdict
			}
		}
	`)
	gqlRequest.Header.Add("Authorization", "Bearer "+token)
	var resp struct {
		Submissions []struct {
			ID         string
			Problem    struct{ Name string }
			Language   struct{ Name string }
			Issuer     struct{ Name string }
			IssuedTime string
			Verdict    string
		}
	}
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return nil, xerrors.Errorf("cannot fetch problems from server: %w", err)
	}

	nSub := len(resp.Submissions)
	submissions := make([]ugrade.SubmissionListItem, nSub, nSub)
	for i, sub := range resp.Submissions {
		submissions[i] = ugrade.SubmissionListItem{
			ID:           sub.ID,
			ProblemName:  sub.Problem.Name,
			LanguageName: sub.Language.Name,
			IssuerName:   sub.Issuer.Name,
			Verdict:      sub.Verdict,
			IssuedAt:     sub.IssuedTime,
		}
	}
	return &ugrade.SubmissionListResult{
		Submissions: submissions,
	}, nil
}
