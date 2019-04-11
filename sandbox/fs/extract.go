package fs

import (
	"archive/tar"
	"io"
	"os"
	"path"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/xi2/xz"
)

func extractImage(imagePath string, sandboxDir string) error {
	logrus.Info("extracting image file")

	// open image file
	logrus.Debug("open image file")
	imageFile, err := os.Open(imagePath)
	if err != nil {
		return errors.Wrap(err, "cannot read image file")
	}
	defer imageFile.Close()

	// create compressed reader
	logrus.Debug("read compressed image file")
	xzReader, err := xz.NewReader(imageFile, 0)
	if err != nil {
		return errors.Wrap(err, "cannot read compressed image file")
	}

	// extract tar
	logrus.Debug("extract tar image file")
	tarReader := tar.NewReader(xzReader)
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		} else if err != nil {
			return errors.Wrap(err, "cannot read next file in image tar")
		}

		spath := path.Join(sandboxDir, header.Name)
		switch header.Typeflag {
		case tar.TypeDir:
			err = os.MkdirAll(spath, 0700)
			if err != nil {
				return errors.Wrap(err, "cannot create directory")
			}
		case tar.TypeReg, tar.TypeRegA:
			w, err := os.Create(spath)
			if err != nil {
				return errors.Wrap(err, "cannot create file")
			}
			_, err = io.Copy(w, tarReader)
			if err != nil {
				return errors.Wrap(err, "cannot write file")
			}
			w.Close()

			if err := os.Chmod(spath, 0700); err != nil {
				return errors.Wrap(err, "cannot change file permission")
			}
		case tar.TypeSymlink:
			if err := os.Symlink(header.Linkname, spath); err != nil {
				return errors.Wrap(err, "cannot create symbolic link")
			}
		case tar.TypeLink:
			targetPath := path.Join(sandboxDir, header.Linkname)
			if err := os.Link(targetPath, spath); err != nil {
				return errors.Wrap(err, "cannot create hard link")
			}
		}
	}
	return nil
}
