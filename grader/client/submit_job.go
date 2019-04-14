package client

import (
	"bytes"
	"context"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
)

func (clt *defaultClient) SubmitJob(ctx context.Context, token string, jobResult grader.JobResult) error {
	bodyBuf := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuf)
	bodyWriter.WriteField("verdict", jobResult.Verdict)

	outputWriter, err := bodyWriter.CreateFormFile("output", "output")
	if err != nil {
		return errors.Wrap(err, "cannot create output writer")
	}

	if _, err := io.Copy(outputWriter, jobResult.Output); err != nil {
		return errors.Wrap(err, "cannot write output to http request")
	}

	bodyWriter.Close()
	req, err := http.NewRequest("POST", clt.serverURL+"/gradings/jobs/", bodyBuf)
	if err != nil {
		return errors.Wrap(err, "cannot create post request")
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("X-Job-Token", jobResult.Job.Token)
	req.Header.Set("Content-Type", bodyWriter.FormDataContentType())
	req.WithContext(ctx)

	resp, err := clt.httpClient.Do(req)
	if err != nil {
		return errors.Wrap(err, "cannot send post http request")
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return errors.Wrapf(err, "get non 2xx status code: %d", resp.StatusCode)
	}
	defer func() {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
	}()

	return nil
}
