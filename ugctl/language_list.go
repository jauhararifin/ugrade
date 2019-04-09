package ugctl

import (
	"context"

	"github.com/jauhararifin/graphql"
	"github.com/pkg/errors"
)

// LanguageListItem represent single language when running `lang ls` command.
type LanguageListItem struct {
	ID         string
	Name       string
	Extensions []string
}

// LanguageListResult represent result of calling `lang ls` command.
type LanguageListResult struct {
	Languages []LanguageListItem
}

func (clt *client) LanguageList(ctx context.Context) (*LanguageListResult, error) {
	token, err := getToken()
	if err != nil {
		return nil, errors.Wrap(err, "cannot get session token")
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
			PermittedLanguages []LanguageListItem
		}
	}
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return nil, errors.Wrap(err, "cannot fetch languages from server")
	}

	return &LanguageListResult{
		Languages: resp.MyContest.PermittedLanguages,
	}, nil
}
