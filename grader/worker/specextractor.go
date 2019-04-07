package worker

import (
	"archive/tar"
	"context"
	"encoding/json"
	"io"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

type program struct {
	filename string
	language string
}

type extractedSpec struct {
	tcgen      program
	solution   program
	checker    program
	submission program
}

func extractSpec(ctx context.Context, workingDir string, spec io.Reader) (res *extractedSpec, err error) {
	// TODO: close extractedSpec result when error occured
	var tcgenFilename string
	var solutionFilename string
	var checkerFilename string
	var submissionFilename string

	var langInfo struct {
		Tcgen      string
		Solution   string
		Checker    string
		Submission string
	}

	logrus.Debug("reading spec tar files")
	tarReader := tar.NewReader(spec)
	for {
		logrus.Trace("reading next file inside tar")
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		} else if err != nil {
			return nil, errors.Wrap(err, "cannot read next file in spec tar")
		}
		logrus.WithField("filename", header.Name).Trace("found item in spec tar")

		if header.Typeflag == tar.TypeReg || header.Typeflag == tar.TypeRegA {
			filename := path.Join(workingDir, header.Name)

			// create file
			logrus.WithField("filename", filename).Trace("create file")
			file, err := os.Create(filename)
			if err != nil {
				return nil, errors.Wrap(err, "cannot create file")
			}
			defer file.Close()

			// fill the file
			logrus.WithField("filename", filename).Trace("write file")
			_, err = io.Copy(file, tarReader)
			if err != nil {
				return nil, errors.Wrap(err, "cannot write file")
			}

			// fill source io.Reader
			baseName := strings.TrimSuffix(header.Name, filepath.Ext(header.Name))
			switch baseName {
			case "tcgen":
				tcgenFilename = header.Name
			case "solution":
				solutionFilename = header.Name
			case "checker":
				checkerFilename = header.Name
			case "submission":
				submissionFilename = header.Name
			default:
				os.Remove(header.Name)
			}

			// handle lang.json file
			if header.Name == "lang.json" {
				logrus.Debug("read language information")
				if _, err := file.Seek(0, 0); err != nil {
					return nil, errors.Wrap(err, "cannot seek the beginning of language info file")
				}
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

	if len(tcgenFilename) == 0 {
		return nil, errors.New("no testcase generator source found")
	}
	if len(solutionFilename) == 0 {
		return nil, errors.New("no jury solution source found")
	}
	if len(checkerFilename) == 0 {
		return nil, errors.New("no checker source found")
	}
	if len(submissionFilename) == 0 {
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
			filename: tcgenFilename,
			language: langInfo.Tcgen,
		},
		solution: program{
			filename: solutionFilename,
			language: langInfo.Solution,
		},
		checker: program{
			filename: checkerFilename,
			language: langInfo.Checker,
		},
		submission: program{
			filename: submissionFilename,
			language: langInfo.Submission,
		},
	}, nil
}
