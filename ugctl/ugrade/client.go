package ugrade

import (
	"context"

	"github.com/machinebox/graphql"
)

// Client contains ugrade functionality
type Client interface {
	SignIn(ctx context.Context, contestShortID, email, password string) error
	SignOut(ctx context.Context) error
	Status(ctx context.Context) error
}

type client struct {
	gqlClient *graphql.Client
}

// GQLServerEndpoint contains url to ugrade graphql api
const GQLServerEndpoint = "http://localhost:8000/graphql"

// NewClient create new graphql client for ugrade server
func NewClient() Client {
	gqlClient := graphql.NewClient(GQLServerEndpoint)
	return &client{
		gqlClient: gqlClient,
	}
}
