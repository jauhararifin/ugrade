package ugrade

import (
	"os"
	"os/user"
	"path"

	"github.com/pkg/errors"
)

func assertWorkingFile(paths ...string) (*os.File, string, error) {
	// ger current user dir
	user, err := user.Current()
	if err != nil {
		return nil, "", errors.WithMessage(err, "cannot get current user working directory")
	}

	fileName := paths[len(paths)-1]
	paths = paths[:len(paths)-1]

	// apend user dir with ugrade dir
	dirPath := []string{user.HomeDir + "/.ugrade"}
	dirPath = append(dirPath, paths...)
	pathResult := path.Join(dirPath...)

	if err := os.MkdirAll(pathResult, 0774); err != nil {
		return nil, "", errors.Wrap(err, "cannot create working directory")
	}

	file, err := os.Create(path.Join(pathResult, fileName))
	if err != nil {
		return nil, "", errors.Wrap(err, "cannot create working file")
	}
	return file, path.Join(pathResult, fileName), nil
}
