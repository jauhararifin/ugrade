package ugctl

import (
	"context"
	"io/ioutil"

	"github.com/jauhararifin/graphql"
	"github.com/pkg/errors"
)

// SignInRequest represent input for sign in command
type SignInRequest struct {
	ContestShortID string
	Email          string
	Password       string
}

// SignInResult represent result of sign in command
type SignInResult struct {
	UserID      string
	UserName    string
	ContestID   string
	ContestName string
}

func (clt *client) SignIn(ctx context.Context, request SignInRequest) (*SignInResult, error) {
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
		return nil, errors.Wrap(err, "cannot fetch contest with short id "+request.ContestShortID)
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
		return nil, errors.Wrap(err, "cannot fetch user with email "+request.Email)
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
		return nil, errors.Wrap(err, "signing in failed")
	}

	tokenPath, err := assertWorkingFile("session.tk")
	if err != nil {
		return nil, errors.Wrap(err, "cannot create session file")
	}
	err = ioutil.WriteFile(tokenPath, []byte(signInRes.SignIn.Token), 0744)
	if err != nil {
		return nil, errors.Wrap(err, "cannot save session token")
	}

	return &SignInResult{
		UserID:      signInRes.SignIn.User.ID,
		UserName:    signInRes.SignIn.User.Name,
		ContestID:   signInRes.SignIn.User.Contest.ID,
		ContestName: signInRes.SignIn.User.Contest.Name,
	}, nil
}
