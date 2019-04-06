package client

import (
	"context"
	"io/ioutil"
	"net/http"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
)

func (clt *defaultClient) GetJob(ctx context.Context, token string) (*grader.Job, error) {
	// prepare http request
	jobURL := clt.serverURL + "/gradings/jobs/"
	req, err := http.NewRequest("GET", jobURL, nil)
	if err != nil {
		return nil, errors.Wrap(err, "cannot create get request")
	}
	req.Header.Add("Authorization", "Bearer "+token)
	req.WithContext(ctx)

	// send http request
	resp, err := clt.httpClient.Do(req)
	if err != nil {
		return nil, errors.Wrap(err, "cannot send http request")
	}

	// check for error response
	if resp.StatusCode == 404 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, grader.ErrNoSuchJob
	} else if resp.StatusCode == 403 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, errors.New("wrong token")
	} else if resp.StatusCode != 200 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, errors.Errorf("http response gives weird status code: %d", resp.StatusCode)
	}

	// take job token
	jobToken := resp.Header.Get("X-Job-Token")
	if len(jobToken) == 0 {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
		return nil, errors.New("http response gives empty job token")
	}

	// create job instance
	job := &grader.Job{
		Token: jobToken,
		Spec:  resp.Body,
	}
	return job, nil
}
