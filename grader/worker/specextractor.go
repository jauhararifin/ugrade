package worker

import (
	"archive/tar"
	"context"
	"encoding/json"
	"io"
	"io/ioutil"
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type program struct {
	source   io.ReadCloser
	language string
}

type extractedSpec struct {
	tcgen      program
	solution   program
	checker    program
	submission program
}

func extractSpec(ctx context.Context, spec io.Reader) (res *extractedSpec, err error) {
	// TODO: close extractedSpec result when error occured
	var tcgenSource io.ReadCloser
	var solutionSource io.ReadCloser
	var checkerSource io.ReadCloser
	var submissionSource io.ReadCloser

	var langInfo struct {
		Tcgen      string
		Solution   string
		Checker    string
		Submission string
	}

	logrus.Trace("reading spec tar files")
	tarReader := tar.NewReader(spec)
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		} else if err != nil {
			return nil, errors.Wrap(err, "cannot read next file in spec tar")
		}
		logrus.WithField("filename", header.Name).Trace("found item in spec tar")

		if header.Typeflag == tar.TypeReg || header.Typeflag == tar.TypeRegA {
			// preparing temporary file
			file, err := tempFile("", "")
			if err != nil {
				file.Close()
				return nil, errors.Wrap(err, "cannot create file")
			}
			_, err = io.Copy(file, tarReader)
			if err != nil {
				file.Close()
				return nil, errors.Wrap(err, "cannot write file")
			}
			_, err = file.Seek(0, 0)
			if err != nil {
				file.Close()
				return nil, errors.Wrap(err, "cannot seek beginning of file")
			}

			// fill source io.Reader
			baseName := strings.TrimSuffix(header.Name, filepath.Ext(header.Name))
			switch baseName {
			case "tcgen":
				tcgenSource = file
			case "solution":
				solutionSource = file
			case "checker":
				checkerSource = file
			case "submission":
				submissionSource = file
			}

			// handle lang.json file
			if header.Name == "lang.json" {
				jsonBytes, err := ioutil.ReadAll(file)
				if err != nil {
					return nil, errors.Wrap(err, "cannot read file")
				}

				logrus.WithField("langJson", string(jsonBytes)).Trace("parsing language info")
				err = json.Unmarshal(jsonBytes, &langInfo)
				if err != nil {
					return nil, errors.Wrap(err, "cannot parse language info")
				}
				logrus.Trace("language info parsed")
			}
		}
	}
	logrus.Trace("reading spec tar files finished")

	if tcgenSource == nil {
		return nil, errors.New("no testcase generator source found")
	}
	if solutionSource == nil {
		return nil, errors.New("no jury solution source found")
	}
	if checkerSource == nil {
		return nil, errors.New("no checker source found")
	}
	if submissionSource == nil {
		return nil, errors.New("no contestant submission source found")
	}
	if len(langInfo.Checker) == 0 ||
		len(langInfo.Solution) == 0 ||
		len(langInfo.Checker) == 0 ||
		len(langInfo.Submission) == 0 {
		return nil, errors.New("invalid language information")
	}

	return &extractedSpec{
		tcgen: program{
			source:   tcgenSource,
			language: langInfo.Tcgen,
		},
		solution: program{
			source:   solutionSource,
			language: langInfo.Solution,
		},
		checker: program{
			source:   checkerSource,
			language: langInfo.Checker,
		},
		submission: program{
			source:   submissionSource,
			language: langInfo.Submission,
		},
	}, nil
}
