package worker

import (
	"io/ioutil"
	"os"
)

type autoCloseTempFile struct {
	*os.File
}

func (actf *autoCloseTempFile) Close() error {
	if err := actf.File.Close(); err != nil {
		return err
	}
	return os.Remove(actf.File.Name())
}

func tempFile(dir, pattern string) (*autoCloseTempFile, error) {
	file, err := ioutil.TempFile(dir, pattern)
	if err != nil {
		return nil, err
	}

	return &autoCloseTempFile{
		File: file,
	}, nil
}
