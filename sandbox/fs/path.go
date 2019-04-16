package fs

import (
	"os"
	"path"
	"path/filepath"

	"golang.org/x/xerrors"
)

func imageSandboxPath(imagePath string) (string, error) {
	absImgPath, err := filepath.Abs(imagePath)
	if err != nil {
		return "", xerrors.Errorf("cannot get image sandbox path: %w", err)
	}
	outPath := path.Join(os.TempDir(), "ugsbox", absImgPath)
	return outPath, nil
}
