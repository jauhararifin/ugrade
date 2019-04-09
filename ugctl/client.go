package ugctl

import (
	"context"

	"github.com/jauhararifin/graphql"
)

// Client contains ugrade functionality
type Client interface {
	SignIn(ctx context.Context, request SignInRequest) (*SignInResult, error)
	SignOut(ctx context.Context) error
	ProblemList(ctx context.Context) (*ProblemListResult, error)
	LanguageList(ctx context.Context) (*LanguageListResult, error)
	SubmissionList(ctx context.Context) (*SubmissionListResult, error)
	Submit(ctx context.Context, request SubmitRequest) (*SubmitResult, error)
}

type client struct {
	gqlClient *graphql.Client
}

// GQLServerEndpoint contains url to ugrade graphql api
var GQLServerEndpoint = "http://localhost:8000/graphql"

// NewClient create new graphql client for ugrade server
func NewClient() Client {
	gqlClient := graphql.NewClient(GQLServerEndpoint, graphql.UseMultipartForm())
	return &client{
		gqlClient: gqlClient,
	}
}
