package file

import (
	"io/ioutil"

	"github.com/pkg/errors"
)

// Copy copy file from input path to outputpath
func Copy(inputPath, outputPath string) error {
	input, err := ioutil.ReadFile(inputPath)
	if err != nil {
		return errors.Wrap(err, "cannot read input file")
	}

	err = ioutil.WriteFile(outputPath, input, 0700)
	if err != nil {
		return errors.Wrap(err, "cannot write output file")
	}

	return nil
}
