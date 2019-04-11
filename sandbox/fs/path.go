package fs

import (
	"os"
	"path"
	"path/filepath"

	"github.com/pkg/errors"
)

func imageSandboxPath(imagePath string) (string, error) {
	absImgPath, err := filepath.Abs(imagePath)
	if err != nil {
		return "", errors.Wrap(err, "cannot get image sandbox path")
	}
	outPath := path.Join(os.TempDir(), "ugsbox", absImgPath)
	return outPath, nil
}
