package client

import (
	"net/http"
	"time"

	"github.com/jauhararifin/ugrade/grader"
)

type defaultClient struct {
	serverURL  string
	httpClient http.Client
}

// New create new default implementation of `grader.Client`.
func New(serverURL string) grader.Client {
	httpClient := http.Client{
		Timeout: 10 * time.Second,
	}
	return &defaultClient{
		serverURL:  serverURL,
		httpClient: httpClient,
	}
}
