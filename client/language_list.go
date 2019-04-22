package client

import (
	"context"

	"github.com/jauhararifin/graphql"
	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (clt *client) Languages(ctx context.Context) (*ugrade.LanguageListResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, xerrors.Errorf("cannot get session token: %w", err)
	}

	gqlRequest := graphql.NewRequest(`
		query GetLanguages {
			myContest {
				permittedLanguages {
					id name extensions
				}
			}
		}
	`)
	gqlRequest.Header.Add("Authorization", "Bearer "+token)
	var resp struct {
		MyContest struct {
			PermittedLanguages []ugrade.LanguageListItem
		}
	}
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return nil, xerrors.Errorf("cannot fetch languages from server: %w", err)
	}

	return &ugrade.LanguageListResult{
		Languages: resp.MyContest.PermittedLanguages,
	}, nil
}
