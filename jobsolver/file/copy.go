package file

import (
	"io"
	"os"

	"github.com/pkg/errors"
)

// Copy copy file from input path to outputpath.
func Copy(inputPath, outputPath string) error {

	input, err := os.OpenFile(inputPath, os.O_RDONLY, 0700)
	if err != nil {
		return errors.Wrap(err, "cannot read input file")
	}
	defer input.Close()

	output, err := os.OpenFile(outputPath, os.O_CREATE|os.O_WRONLY, 0700)
	if err != nil {
		return errors.Wrap(err, "cannot open target file")
	}
	defer output.Close()

	if _, err := io.Copy(output, input); err != nil {
		return errors.Wrap(err, "cannot copy input file to target file")
	}

	return nil
}
