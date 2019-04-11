package fs

import (
	"os"
	"path/filepath"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// PrepareFS extracts compressed image (.tar.xz) to temporary folder
func PrepareFS(imagePath string, uid int, gid int) (*sandbox.Path, error) {
	// open image file
	logrus.WithField("image", imagePath).Debug("open image file")
	imFile, err := os.Open(imagePath)
	if err != nil {
		return nil, errors.Wrap(err, "cannot open image file")
	}
	defer imFile.Close()

	// get output image path
	outPath, err := imageSandboxPath(imagePath)
	if err != nil {
		return nil, errors.Wrap(err, "cannot determine sandbox directory")
	}
	logrus.WithField("image", imagePath).WithField("sandbox", outPath).Debug("use sandbox directory")

	// check if image already extracted
	logrus.WithField("sandbox", outPath).Debug("check sandbox directory")
	if stat, err := os.Stat(outPath); err == nil {
		if stat.IsDir() {
			return &sandbox.Path{
				Host:    outPath,
				Sandbox: "/",
			}, nil
		}
		return nil, errors.Errorf("image sandbox already exists but is not a directory %s", outPath)
	}

	// make image sandbox dir
	logrus.WithField("sandbox", outPath).Debug("create directory for sandboxed image")
	if err := os.MkdirAll(outPath, 0700); err != nil {
		return nil, errors.Wrap(err, "cannot create directory for sandboxed image")
	}

	// extract image
	logrus.WithField("sandbox", outPath).WithField("image", imagePath).Debug("extract image to sandbox directory")
	if err := extractImage(imagePath, outPath); err != nil {
		return nil, errors.Wrap(err, "cannot extract image to sandboxed directory")
	}

	// change sandbox dir owner
	logrus.WithField("uid", uid).WithField("gid", gid).Debug("change file owner of files in sandboxed directory")
	filepath.Walk(outPath, func(name string, info os.FileInfo, err error) error {
		if err == nil {
			err := os.Chown(name, uid, gid)
			return errors.Wrap(err, "cannot set owner of sandboxed directory")
		}
		return err
	})

	return &sandbox.Path{
		Host:    outPath,
		Sandbox: "/",
	}, nil
}
