package client

import (
	"net/http"
	"time"
)

type defaultClient struct {
	serverURL  string
	httpClient http.Client
}

// New create new default implementation of `Client`.
func New(serverURL string) Client {
	httpClient := http.Client{
		Timeout: 10 * time.Second,
	}
	return &defaultClient{
		serverURL:  serverURL,
		httpClient: httpClient,
	}
}
