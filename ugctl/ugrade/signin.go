package ugrade

import (
	"context"
	"fmt"
	"io/ioutil"

	"github.com/jauhararifin/graphql"
	"github.com/pkg/errors"
)

func (clt *client) SignIn(ctx context.Context, contestShordID, email, password string) error {
	// fetching contest
	gqlReq := graphql.NewRequest(`
		query GetContestId($shortId: String!) {
			contest: contestByShortId(shortId: $shortId) {
				id
			}
		}
	`)
	gqlReq.Var("shortId", contestShordID)
	var getContestRes struct {
		Contest struct {
			ID string
		}
	}
	err := clt.gqlClient.Run(ctx, gqlReq, &getContestRes)
	if err != nil {
		return errors.Wrap(err, "cannot fetch contest with short id "+contestShordID)
	}

	// fetching user
	gqlReq = graphql.NewRequest(`
		query GetUserId($contestId: ID!, $email: String!) {
			user: userByEmail(contestId: $contestId, email: $email) {
				id
			}
		}
	`)
	gqlReq.Var("contestId", getContestRes.Contest.ID)
	gqlReq.Var("email", email)
	var userByEmailRes struct {
		User struct {
			ID string
		}
	}
	err = clt.gqlClient.Run(ctx, gqlReq, &userByEmailRes)
	if err != nil {
		return errors.Wrap(err, "cannot fetch user with email "+email)
	}

	// signin
	gqlReq = graphql.NewRequest(`
		mutation SignIn($userId: ID!, $password: String!) {
			signIn(userId: $userId, password: $password) {
				token
				user {
					id
					name
					contest {
						id
						name
					}
				}
			}
		}
	`)
	gqlReq.Var("userId", userByEmailRes.User.ID)
	gqlReq.Var("password", password)
	var signInRes struct {
		SignIn struct {
			Token string
			User  struct {
				ID      string
				Name    string
				Contest struct {
					ID   string
					Name string
				}
			}
		}
	}
	err = clt.gqlClient.Run(ctx, gqlReq, &signInRes)
	if err != nil {
		return errors.Wrap(err, "signing in failed")
	}

	tokenPath, err := assertWorkingFile("session.tk")
	if err != nil {
		return errors.Wrap(err, "cannot create session file")
	}
	err = ioutil.WriteFile(tokenPath, []byte(signInRes.SignIn.Token), 0744)
	if err != nil {
		return errors.Wrap(err, "cannot save session token")
	}

	fmt.Println("Signin using email:", email)
	fmt.Println("Used ID:", signInRes.SignIn.User.ID)
	fmt.Println("User Name:", signInRes.SignIn.User.Name)
	fmt.Println("Contest ID:", signInRes.SignIn.User.Contest.ID)
	fmt.Println("Contest Name:", signInRes.SignIn.User.Contest.Name)
	fmt.Println("Token file saved to", tokenPath)

	return nil
}
