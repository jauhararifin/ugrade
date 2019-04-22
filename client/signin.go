package client

import (
	"context"
	"io/ioutil"

	"github.com/jauhararifin/graphql"
	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (clt *client) SignIn(ctx context.Context, request ugrade.SignInRequest) (*ugrade.SignInResult, error) {
	// fetching contest
	gqlReq := graphql.NewRequest(`
		query GetContestId($shortId: String!) {
			contest: contestByShortId(shortId: $shortId) {
				id
			}
		}
	`)
	gqlReq.Var("shortId", request.ContestShortID)
	var getContestRes struct {
		Contest struct {
			ID string
		}
	}
	err := clt.gqlClient.Run(ctx, gqlReq, &getContestRes)
	if err != nil {
		return nil, xerrors.Errorf("cannot fetch contest with short id "+request.ContestShortID+": %w", err)
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
	gqlReq.Var("email", request.Email)
	var userByEmailRes struct {
		User struct {
			ID string
		}
	}
	err = clt.gqlClient.Run(ctx, gqlReq, &userByEmailRes)
	if err != nil {
		return nil, xerrors.Errorf("cannot fetch user with email "+request.Email+": %w", err)
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
	gqlReq.Var("password", request.Password)
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
		return nil, xerrors.Errorf("signing in failed: %w", err)
	}

	tokenPath, err := assertWorkingFile("session.tk")
	if err != nil {
		return nil, xerrors.Errorf("cannot create session file: %w", err)
	}
	err = ioutil.WriteFile(tokenPath, []byte(signInRes.SignIn.Token), 0744)
	if err != nil {
		return nil, xerrors.Errorf("cannot save session token: %w", err)
	}

	return &ugrade.SignInResult{
		UserID:      signInRes.SignIn.User.ID,
		UserName:    signInRes.SignIn.User.Name,
		ContestID:   signInRes.SignIn.User.Contest.ID,
		ContestName: signInRes.SignIn.User.Contest.Name,
	}, nil
}
