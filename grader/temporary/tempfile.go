package temporary

import (
	"io/ioutil"
	"os"
)

// AutoCloseTempFile represent `os.File` but automatically remove it when closed.
type AutoCloseTempFile struct {
	*os.File
}

// Close close file and remove it.
func (actf *AutoCloseTempFile) Close() error {
	if err := actf.File.Close(); err != nil {
		return err
	}
	return os.Remove(actf.File.Name())
}

// File create temporary file and remove when Close is called.
func File(dir, pattern string) (*AutoCloseTempFile, error) {
	file, err := ioutil.TempFile(dir, pattern)
	if err != nil {
		return nil, err
	}

	return &AutoCloseTempFile{
		File: file,
	}, nil
}
