package temporary

import (
	"io/ioutil"
	"os"
)

// AutoRemoveFile represent `os.File` but automatically remove it when closed.
type AutoRemoveFile struct {
	*os.File
}

// Close close file and remove it.
func (actf *AutoRemoveFile) Close() error {
	if err := actf.File.Close(); err != nil {
		return err
	}
	return os.Remove(actf.File.Name())
}

// File create temporary file and remove when Close is called.
func File(dir, pattern string) (*AutoRemoveFile, error) {
	file, err := ioutil.TempFile(dir, pattern)
	if err != nil {
		return nil, err
	}

	return &AutoRemoveFile{
		File: file,
	}, nil
}
