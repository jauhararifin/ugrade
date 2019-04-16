package client

import (
	"context"
	"io/ioutil"
	"net/http"

	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (clt *defaultClient) GetJob(ctx context.Context, token string) (*Job, error) {
	// prepare http request
	jobURL := clt.serverURL + "/gradings/jobs/"
	req, err := http.NewRequest("GET", jobURL, nil)
	if err != nil {
		return nil, xerrors.Errorf("cannot create get request: %w", err)
	}
	req.Header.Add("Authorization", "Bearer "+token)
	req.WithContext(ctx)

	// send http request
	resp, err := clt.httpClient.Do(req)
	if err != nil {
		return nil, xerrors.Errorf("cannot send http request: %w", err)
	}

	// check for error response
	if resp.StatusCode == 404 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, ugrade.ErrNoSuchJob
	} else if resp.StatusCode == 403 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, xerrors.New("wrong token")
	} else if resp.StatusCode != 200 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, xerrors.Errorf("http response gives weird status code: %d", resp.StatusCode)
	}

	// take job token
	jobToken := resp.Header.Get("X-Job-Token")
	if len(jobToken) == 0 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, xerrors.New("http response gives empty job token")
	}

	// create job instance
	job := &Job{
		Token: jobToken,
		Spec:  resp.Body,
	}
	return job, nil
}
