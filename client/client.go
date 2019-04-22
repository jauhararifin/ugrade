package client

import (
	"github.com/jauhararifin/graphql"
	"github.com/jauhararifin/ugrade"
)

type client struct {
	gqlClient *graphql.Client
}

// NewClient create new graphql implementation of `ugrade.Client`.
func NewClient(serverURL string) ugrade.Client {
	gqlClient := graphql.NewClient(serverURL+"/graphql", graphql.UseMultipartForm())
	return &client{
		gqlClient: gqlClient,
	}
}
