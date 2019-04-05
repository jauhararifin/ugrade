package ugrade

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/machinebox/graphql"
	"github.com/olekukonko/tablewriter"

	"github.com/pkg/errors"
)

func (clt *client) Status(ctx context.Context) error {
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
		fmt.Println("You are not signed in yet")
		return nil
	}

	gqlRequest := graphql.NewRequest(`
		query GetStatus {
			user: me {
				id name username email
			}
			contest: myContest {
				id shortId name shortDescription startTime finishTime freezed
				permittedLanguages {
					id name
				}
				problems {
					id shortId name
				}
			}
		}
	`)
	gqlRequest.Header.Add("Authorization", "Bearer "+token)
	var resp struct {
		User struct {
			ID       string
			Name     string
			Username string
			Email    string
		}
		Contest struct {
			ID                 string
			ShortID            string
			Name               string
			ShortDescription   string
			StartTime          string
			FinishTime         string
			Freezed            bool
			PermittedLanguages []struct {
				ID   string
				Name string
			}
			Problems []struct {
				ID      string
				ShortID string
				Name    string
			}
		}
	}
	err = clt.gqlClient.Run(ctx, gqlRequest, &resp)
	if err != nil {
		return errors.Wrap(err, "cannot query status to server")
	}

	fmt.Println("You are signed in as:", resp.User.Name)
	fmt.Println()
	fmt.Println("User ID:", resp.User.ID)
	fmt.Println("User Email:", resp.User.Email)
	fmt.Println("User Username:", resp.User.Username)

	fmt.Println()
	fmt.Println("Contest ID:", resp.Contest.ID)
	fmt.Println("Contest Short ID:", resp.Contest.ShortID)
	fmt.Println("Contest Name:", resp.Contest.Name)
	fmt.Println("Contest Short Desc:", resp.Contest.ShortDescription)
	fmt.Println("Contest Start:", resp.Contest.StartTime)
	fmt.Println("Contest Finish:", resp.Contest.FinishTime)
	fmt.Println("Contest Is Freezed:", resp.Contest.Freezed)

	fmt.Println()
	fmt.Println("Permitted Languages:")
	table := tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"ID", "Name"})
	for _, lang := range resp.Contest.PermittedLanguages {
		table.Append([]string{lang.ID, lang.Name})
	}
	table.Render()

	fmt.Println()
	fmt.Println("Problems:")
	table = tablewriter.NewWriter(os.Stdout)
	table.SetHeader([]string{"ID", "Short ID", "Name"})
	for _, prob := range resp.Contest.Problems {
		table.Append([]string{prob.ID, prob.ShortID, prob.Name})
	}
	table.Render()

	return nil
}
