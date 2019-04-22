package client

import (
	"context"
	"os"

	"github.com/jauhararifin/graphql"
	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (clt *client) Submit(ctx context.Context, request ugrade.SubmitRequest) (*ugrade.SubmitResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, xerrors.Errorf("cannot get session token: %w", err)
	}

	file, err := os.Open(request.SourceCode)
	if err != nil {
		return nil, xerrors.Errorf("cannot open source code file: %w", err)
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
		return nil, xerrors.Errorf("cannot submit solution: %w", err)
	}

	return &ugrade.SubmitResult{
		ID: resp.SubmitSolution.ID,
	}, nil
}
