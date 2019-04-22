package client

import (
	"os"
	"os/user"
	"path"

	"golang.org/x/xerrors"
)

func workingDir() (string, error) {
	user, err := user.Current()
	if err != nil {
		return "", xerrors.Errorf("cannot get current user: %w", err)
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
		return "", xerrors.Errorf("cannot get current user working directory: %w", err)
	}

	fileName := paths[len(paths)-1]
	paths = paths[:len(paths)-1]

	// apend user dir with ugrade dir
	dirPath := []string{user.HomeDir + "/.ugrade"}
	dirPath = append(dirPath, paths...)
	pathResult := path.Join(dirPath...)

	if err := os.MkdirAll(pathResult, 0774); err != nil {
		return "", xerrors.Errorf("cannot create working directory: %w", err)
	}

	filePath := path.Join(pathResult, fileName)
	_, err = os.Stat(filePath)
	if os.IsNotExist(err) {
		file, err := os.Create(filePath)
		if err != nil {
			return "", xerrors.Errorf("cannot create working file: %w", err)
		}
		defer file.Close()
	} else if err != nil {
		xerrors.Errorf("cannot open working file: %w", err)
	}
	return filePath, nil
}
