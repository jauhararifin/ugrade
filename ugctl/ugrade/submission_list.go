package ugrade

import (
	"context"

	"github.com/jauhararifin/graphql"
	"github.com/pkg/errors"
)

// SubmissionListItem represent single submission when running `submission ls` command.
type SubmissionListItem struct {
	ID           string
	ProblemName  string
	LanguageName string
	IssuerName   string
	Verdict      string
	IssuedAt     string
}

// SubmissionListResult represent result of calling `submission ls` command.
type SubmissionListResult struct {
	Submissions []SubmissionListItem
}

func (clt *client) SubmissionList(ctx context.Context) (*SubmissionListResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, errors.Wrap(err, "cannot get session token")
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
		return nil, errors.Wrap(err, "cannot fetch problems from server")
	}

	nSub := len(resp.Submissions)
	submissions := make([]SubmissionListItem, nSub, nSub)
	for i, sub := range resp.Submissions {
		submissions[i] = SubmissionListItem{
			ID:           sub.ID,
			ProblemName:  sub.Problem.Name,
			LanguageName: sub.Language.Name,
			IssuerName:   sub.Issuer.Name,
			Verdict:      sub.Verdict,
			IssuedAt:     sub.IssuedTime,
		}
	}
	return &SubmissionListResult{
		Submissions: submissions,
	}, nil
}
