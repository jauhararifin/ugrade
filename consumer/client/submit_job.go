package client

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"

	"golang.org/x/xerrors"
)

func (clt *defaultClient) SubmitJob(ctx context.Context, token string, jobResult JobResult) error {
	bodyBuf := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuf)
	bodyWriter.WriteField("verdict", fmt.Sprint(jobResult.Verdict))

	outputWriter, err := bodyWriter.CreateFormFile("output", "output")
	if err != nil {
		return xerrors.Errorf("cannot create output writer: %w", err)
	}

	if _, err := io.Copy(outputWriter, jobResult.Output); err != nil {
		return xerrors.Errorf("cannot write output to http request: %w", err)
	}

	bodyWriter.Close()
	req, err := http.NewRequest("POST", clt.serverURL+"/gradings/jobs/", bodyBuf)
	if err != nil {
		return xerrors.Errorf("cannot create post request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("X-Job-Token", jobResult.Job.Token)
	req.Header.Set("Content-Type", bodyWriter.FormDataContentType())
	req.WithContext(ctx)

	resp, err := clt.httpClient.Do(req)
	if err != nil {
		return xerrors.Errorf("cannot send post http request: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return xerrors.Errorf("get non 2xx status code: %d: %w", resp.StatusCode, err)
	}
	defer func() {
		ioutil.ReadAll(resp.Body)
		resp.Body.Close()
	}()

	return nil
}
