package ugrade

import (
	"context"
	"os"

	"github.com/jauhararifin/graphql"

	"github.com/pkg/errors"
)

// SubmitRequest represent input for submit command
type SubmitRequest struct {
	LanguageID string
	ProblemID  string
	SourceCode string
}

// SubmitResult represent result of submit command
type SubmitResult struct {
	ID string
}

func (clt *client) Submit(ctx context.Context, request SubmitRequest) (*SubmitResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, errors.Wrap(err, "cannot get session token")
	}

	file, err := os.Open(request.SourceCode)
	if err != nil {
		return nil, errors.Wrap(err, "cannot open source code file")
	}
	defer file.Close()

	gqlRequest := graphql.NewRequest(`
		mutation Submit($languageId: ID!, $problemId: ID!, $sourceCode: Upload!) {
			submitSolution(languageId: $languageId, problemId: $problemId, sourceCode: $sourceCode) {
				id problem { name } language { name } issuedTime
			}
		}
	`)
	var resp struct {
		SubmitSolution struct {
			ID      string
			Problem struct {
				Name string
			}
			Language struct {
				Name string
			}
			IssuedTime string
		}
	}
	gqlRequest.Var("languageId", request.LanguageID)
	gqlRequest.Var("problemId", request.ProblemID)
	gqlRequest.File("sourceCode", request.SourceCode, file)
	gqlRequest.Header.Add("Authorization", "Bearer "+token)
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return nil, errors.Wrap(err, "cannot submit solution")
	}

	return &SubmitResult{
		ID: resp.SubmitSolution.ID,
	}, nil
}
