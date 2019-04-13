package image

import (
	"errors"
	"os"
	"path"
)

// Path search sandbox image which filename is `imageName` and returns the absolute path.
func Path(imageName string) (string, error) {
	lookupPaths := []string{
		"/usr/share/ugrade/images",
		"~/.ugrade/images",
	}

	for _, dir := range lookupPaths {
		imagePath := path.Join(dir, imageName+".tar.xz")
		info, err := os.Stat(imagePath)
		if err != nil || info.IsDir() {
			continue
		}
		return imagePath, nil
	}

	return "", errors.New("image not found")
}
