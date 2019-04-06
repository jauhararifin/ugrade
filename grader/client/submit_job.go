package client

import (
	"bytes"
	"context"
	"io"
	"mime/multipart"
	"net/http"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/pkg/errors"
)

func (clt *defaultClient) SubmitJob(ctx context.Context, token string, jobResult grader.JobResult) error {
	bodyBuf := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuf)
	bodyWriter.WriteField("verdict", jobResult.Verdict)

	outputWriter, err := bodyWriter.CreateFormField("output")
	if err != nil {
		return errors.Wrap(err, "cannot create output writer")
	}

	if _, err := io.Copy(outputWriter, jobResult.Output); err != nil {
		return errors.Wrap(err, "cannot write output to http request")
	}
	jobResult.Output.Close()

	bodyWriter.Close()
	req, err := http.NewRequest("POST", clt.serverURL+"/gradings/job/", bodyBuf)
	if err != nil {
		return errors.Wrap(err, "cannot create post request")
	}
	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("X-Job-Token", jobResult.Job.Token)
	req.WithContext(ctx)

	resp, err := clt.httpClient.Do(req)
	if err != nil {
		return errors.Wrap(err, "cannot send post http request")
	}
	defer resp.Body.Close()

	return nil
}
