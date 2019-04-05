package ugrade

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/jauhararifin/graphql"

	"github.com/pkg/errors"
)

func (clt *client) Submit(ctx context.Context, languageID, problemID, sourceCode string) error {
	tokenPath, err := assertWorkingFile("session.tk")
	if err != nil {
		return errors.Wrap(err, "cannot open session file")
	}
	tokenBt, err := ioutil.ReadFile(tokenPath)
	if err != nil {
		return errors.Wrap(err, "cannot read session file")
	}
	token := string(tokenBt)
	if len(token) == 0 {
		return errors.New("you havent signed in yet")
	}

	file, err := os.Open(sourceCode)
	if err != nil {
		return errors.Wrap(err, "cannot open source code file")
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
	gqlRequest.Var("languageId", languageID)
	gqlRequest.Var("problemId", problemID)
	gqlRequest.File("sourceCode", sourceCode, file)
	gqlRequest.Header.Add("Authorization", "Bearer "+token)
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return errors.Wrap(err, "cannot submit solution")
	}

	fmt.Println("Solution submitted with:")
	fmt.Println("  ID:", resp.SubmitSolution.ID)
	fmt.Println("  Problem:", resp.SubmitSolution.Problem.Name)
	fmt.Println("  Language:", resp.SubmitSolution.Language.Name)
	fmt.Println("  Issued At:", resp.SubmitSolution.IssuedTime)

	return nil
}
