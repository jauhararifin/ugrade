package fs

import (
	"os"

	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

func (fs *defaultFS) Load(imagePath string, uid, gid int) error {
	// open image file
	logrus.WithField("image", imagePath).Debug("open image file")
	imFile, err := os.Open(imagePath)
	if err != nil {
		return xerrors.Errorf("cannot open image file: %w", err)
	}
	defer imFile.Close()

	// get output image path
	outPath, err := imageSandboxPath(imagePath)
	if err != nil {
		return xerrors.Errorf("cannot determine sandbox directory: %w", err)
	}
	logrus.WithField("image", imagePath).WithField("sandbox", outPath).Debug("use sandbox directory")

	// check if image already extracted
	logrus.WithField("sandbox", outPath).Debug("check sandbox directory")
	if stat, err := os.Stat(outPath); err == nil {
		if stat.IsDir() {
			return nil
		}
		return xerrors.Errorf("image sandbox already exists but is not a directory %s", outPath)
	}

	// make image sandbox dir
	logrus.WithField("sandbox", outPath).Debug("create directory for sandboxed image")
	if err := os.MkdirAll(outPath, 0744); err != nil {
		return xerrors.Errorf("cannot create directory for sandboxed image: %w", err)
	}

	// extract image
	logrus.WithField("sandbox", outPath).WithField("image", imagePath).Debug("extract image to sandbox directory")
	if err := extractImage(imagePath, outPath); err != nil {
		return xerrors.Errorf("cannot extract image to sandboxed directory: %w", err)
	}

	// change sandbox dir owner
	logrus.WithField("uid", uid).WithField("gid", gid).Debug("change file owner of files in sandboxed directory")
	if err := fs.chownDir(outPath, uid, gid); err != nil {
		return xerrors.Errorf("cannot change owner of sandboxed directory: %w", err)
	}

	return nil
}
