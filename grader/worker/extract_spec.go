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

	"github.com/jauhararifin/ugrade/sandbox"
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

	timeLimit   uint
	outputLimit uint
	memoryLimit uint
	tolerance   float32

	workDir sandbox.Path
}

func (worker *defaultWorker) extractSpec(
	ctx context.Context,
	workDir sandbox.Path,
	spec io.Reader,
) (*extractedSpec, error) {
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

	var problemInfo struct {
		TimeLimit   uint
		OutputLimit uint
		MemoryLimit uint
		Tolerance   float32
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
			filename := path.Join(workDir.Host, header.Name)
			baseName := strings.TrimSuffix(header.Name, filepath.Ext(header.Name))

			// skip file if the file is unrecognized
			if baseName != "tcgen" &&
				baseName != "solution" &&
				baseName != "checker" &&
				baseName != "submission" &&
				header.Name != "lang.json" &&
				header.Name != "problem.json" {
				logrus.WithField("headerName", header.Name).Trace("skip unrecognize file")
				continue
			}

			// create file
			logrus.WithField("filename", filename).Trace("create file")
			file, err := os.Create(filename)
			if err != nil {
				return nil, errors.Wrap(err, "cannot create file")
			}
			defer file.Close()

			// copying from tar to the file
			logrus.WithField("filename", filename).Trace("write file")
			nbytes, err := io.Copy(file, tarReader)
			if err != nil {
				return nil, errors.Wrap(err, "cannot write file")
			}
			logrus.WithField("nbytes", nbytes).Trace("file copied")

			// fill variables for return value
			switch baseName {
			case "tcgen":
				tcgenFilename = header.Name
			case "solution":
				solutionFilename = header.Name
			case "checker":
				checkerFilename = header.Name
			case "submission":
				submissionFilename = header.Name
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

				logrus.WithField("langJson", string(jsonBytes)).Debug("parsing language info")
				err = json.Unmarshal(jsonBytes, &langInfo)
				if err != nil {
					return nil, errors.Wrap(err, "cannot parse language info")
				}
				logrus.Debug("language info parsed")
			}

			// handle problem.json file
			if header.Name == "problem.json" {
				logrus.Debug("read problem information")
				if _, err := file.Seek(0, 0); err != nil {
					return nil, errors.Wrap(err, "cannot seek then beginning of problem info file")
				}
				jsonBytes, err := ioutil.ReadAll(file)
				if err != nil {
					return nil, errors.Wrap(err, "cannot read file")
				}

				logrus.WithField("problemJson", string(jsonBytes)).Debug("parsing problem info")
				err = json.Unmarshal(jsonBytes, &problemInfo)
				if err != nil {
					return nil, errors.Wrap(err, "cannot parse problem info")
				}
				logrus.Debug("problem info parsed")
			}
		}
	}
	logrus.Debug("reading spec tar files finished")

	// check validity
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
	if problemInfo.TimeLimit == 0 ||
		problemInfo.OutputLimit == 0 ||
		problemInfo.MemoryLimit == 0 ||
		problemInfo.Tolerance == 0 {
		return nil, errors.New("invalid problem information")
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

		timeLimit:   problemInfo.TimeLimit,
		outputLimit: problemInfo.OutputLimit,
		memoryLimit: problemInfo.MemoryLimit,
		tolerance:   problemInfo.Tolerance,

		workDir: workDir,
	}, nil
}
