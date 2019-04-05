package ugrade

import (
	"os"
	"os/user"
	"path"

	"github.com/pkg/errors"
)

func workingDir() (string, error) {
	user, err := user.Current()
	if err != nil {
		return "", errors.Wrap(err, "cannot get current user")
	}

	homeDir := user.HomeDir
	ugradeDir := ".ugrade"
	result := path.Join(homeDir, ugradeDir)

	return result, nil
}

func assertWorkingFile(paths ...string) (string, error) {
	// ger current user dir
	user, err := user.Current()
	if err != nil {
		return "", errors.WithMessage(err, "cannot get current user working directory")
	}

	fileName := paths[len(paths)-1]
	paths = paths[:len(paths)-1]

	// apend user dir with ugrade dir
	dirPath := []string{user.HomeDir + "/.ugrade"}
	dirPath = append(dirPath, paths...)
	pathResult := path.Join(dirPath...)

	if err := os.MkdirAll(pathResult, 0774); err != nil {
		return "", errors.Wrap(err, "cannot create working directory")
	}

	filePath := path.Join(pathResult, fileName)
	_, err = os.Stat(filePath)
	if os.IsNotExist(err) {
		file, err := os.Create(filePath)
		if err != nil {
			return "", errors.Wrap(err, "cannot create working file")
		}
		defer file.Close()
	} else if err != nil {
		errors.Wrap(err, "cannot open working file")
	}
	return filePath, nil
}
