package worker

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"path"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (worker *defaultWorker) getTCSampleCount(ctx context.Context, tcgen compilationResult) (int, error) {
	var outputBuff bytes.Buffer
	logrus.Debug("get sample count")
	_, err := worker.run(ctx, tcgen, []string{"sample_count"}, nil, &outputBuff)
	if err != nil {
		return 0, errors.Wrap(err, "cannot get sample count")
	}
	var nSample int
	fmt.Fscanf(&outputBuff, "%d", &nSample)
	logrus.WithField("sampleCount", nSample).Debug("successfully get sample count")
	return nSample, nil
}

func (worker *defaultWorker) getTCCount(ctx context.Context, tcgen compilationResult) (int, error) {
	var outputBuff bytes.Buffer
	logrus.Debug("get testcase count")
	_, err := worker.run(ctx, tcgen, []string{"testcase_count"}, nil, &outputBuff)
	if err != nil {
		return 0, errors.Wrap(err, "cannot get testcase count")
	}
	var nTC int
	fmt.Fscanf(&outputBuff, "%d", &nTC)
	logrus.WithField("testcaseCount", nTC).Debug("successfully get testcase count")
	return nTC, nil
}

func (worker *defaultWorker) generateTCFile(
	ctx context.Context,
	tcgen compilationResult,
	sample bool,
	id int,
) (string, error) {
	typ := "testcase"
	if sample {
		typ = "sample"
	}
	idstr := fmt.Sprintf("%d", id)
	outputFilename := fmt.Sprintf("tc-input-%s-%d.in", typ, id)
	outputPath := path.Join(tcgen.workDir.Host, outputFilename)

	outputFile, err := os.Create(outputPath)
	if err != nil {
		return "", errors.Wrap(err, "cannot create output file for input testcase")
	}
	defer outputFile.Close()

	logrus.WithField("sample", sample).WithField("id", id).Debug("generate testcase input file")
	res, err := worker.run(ctx, tcgen, []string{typ, idstr}, nil, outputFile)
	if err != nil {
		return "", errors.Wrap(err, "cannot get testcase count")
	}
	logrus.WithField("executionResult", res).Debug("successfully get testcase count")
	return outputFilename, nil
}

type inputFiles struct {
	workDir sandbox.Path
	files   []string
}

func (worker *defaultWorker) generateTCInputs(ctx context.Context, tcgen compilationResult) (*inputFiles, error) {
	// getting sample count
	nSample, err := worker.getTCSampleCount(ctx, tcgen)
	if err != nil {
		return nil, errors.Wrap(err, "cannot get sample count")
	}

	// getting testcase count
	nTC, err := worker.getTCCount(ctx, tcgen)
	if err != nil {
		return nil, errors.Wrap(err, "cannot get testcase count")
	}

	// generate testcases
	logrus.WithField("sampleCount", nSample).WithField("testcaseCount", nTC).Debug("generating testcase")
	testcaseFilenames := make([]string, 0, 0)
	for i := 1; i <= nSample; i++ {
		filename, err := worker.generateTCFile(ctx, tcgen, true, i)
		if err != nil {
			return nil, errors.Wrap(err, "cannot generate sample input")
		}
		testcaseFilenames = append(testcaseFilenames, filename)
	}
	for i := 1; i <= nTC; i++ {
		filename, err := worker.generateTCFile(ctx, tcgen, false, i)
		if err != nil {
			return nil, errors.Wrap(err, "cannot generate testcase input")
		}
		testcaseFilenames = append(testcaseFilenames, filename)
	}

	return &inputFiles{
		workDir: tcgen.workDir,
		files:   testcaseFilenames,
	}, nil
}
