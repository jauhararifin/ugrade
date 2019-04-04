package main

import (
	"bytes"
	"flag"
	"fmt"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"time"
)

func submitResult(jobToken string, verdict string, outputFile string) error {
	bodyBuf := &bytes.Buffer{}
	bodyWriter := multipart.NewWriter(bodyBuf)

	bodyWriter.WriteField("jobToken", jobToken)
	bodyWriter.WriteField("verdict", verdict)

	fileWriter, err := bodyWriter.CreateFormFile("output", outputFile)
	if err != nil {
		fmt.Println("error writing to buffer")
		return err
	}

	fh, err := os.Open(outputFile)
	if err != nil {
		fmt.Println("error opening file")
		return err
	}
	defer fh.Close()

	_, err = io.Copy(fileWriter, fh)
	if err != nil {
		return err
	}

	contentType := bodyWriter.FormDataContentType()
	bodyWriter.Close()

	resp, err := http.Post("http://localhost:8000/gradings/jobs/", contentType, bodyBuf)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	fmt.Println(resp.Status)
	fmt.Println(string(respBody))
	return nil
}

func handleResponse(resp *http.Response) {
	fmt.Println(resp)

	if resp.StatusCode == 404 {
		fmt.Println("No job")
		return
	} else if resp.StatusCode == 403 {
		fmt.Println("Wrong Token")
		return
	} else if resp.StatusCode != 200 {
		fmt.Println("Get job returns status code ", resp.StatusCode)
		return
	}

	jobToken := resp.Header.Get("X-Job-Token")
	if len(jobToken) == 0 {
		fmt.Println("Job token contain zero string")
		return
	}

	outFile, err := os.Create("/tmp/test")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer outFile.Close()

	written, err := io.Copy(outFile, resp.Body)
	if err != nil {
		fmt.Println(err)
		return
	}

	time.Sleep(2 * time.Second)

	result := "AC"
	if written%2 == 0 {
		result = "WA"
	}
	submitResult(jobToken, result, "/tmp/test")
}

func main() {
	token := flag.String("token", "token", "Session token from server session")
	flag.Parse()

	serverURL := "http://localhost:8000"
	jobURL := serverURL + "/gradings/jobs/"
	client := &http.Client{}
	for {
		time.Sleep(5 * time.Second)

		req, err := http.NewRequest("GET", jobURL, nil)
		if err != nil {
			fmt.Println(err)
			continue
		}
		req.Header["Authorization"] = []string{"Bearer " + *token}

		resp, err := client.Do(req)
		if err != nil {
			fmt.Println(err)
			continue
		}
		handleResponse(resp)
	}
}
