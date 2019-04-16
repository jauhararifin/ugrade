package fs

import (
	"archive/tar"
	"io"
	"os"
	"path"

	"github.com/sirupsen/logrus"
	"github.com/xi2/xz"
	"golang.org/x/xerrors"
)

func extractImage(imagePath string, sandboxDir string) error {
	logrus.Info("extracting image file")

	// open image file
	logrus.Debug("open image file")
	imageFile, err := os.Open(imagePath)
	if err != nil {
		return xerrors.Errorf("cannot read image file: %w", err)
	}
	defer imageFile.Close()

	// create compressed reader
	logrus.Debug("read compressed image file")
	xzReader, err := xz.NewReader(imageFile, 0)
	if err != nil {
		return xerrors.Errorf("cannot read compressed image file: %w", err)
	}

	// extract tar
	logrus.Debug("extract tar image file")
	tarReader := tar.NewReader(xzReader)
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		} else if err != nil {
			return xerrors.Errorf("cannot read next file in image tar: %w", err)
		}

		spath := path.Join(sandboxDir, header.Name)
		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(spath, 0700); err != nil {
				return xerrors.Errorf("cannot create directory: %w", err)
			}
		case tar.TypeReg, tar.TypeRegA:
			w, err := os.Create(spath)
			if err != nil {
				return xerrors.Errorf("cannot create file: %w", err)
			}
			if _, err := io.Copy(w, tarReader); err != nil {
				return xerrors.Errorf("cannot write file: %w", err)
			}
			w.Close()

			if err := os.Chmod(spath, 0700); err != nil {
				return xerrors.Errorf("cannot change file permission: %w", err)
			}
		case tar.TypeSymlink:
			if err := os.Symlink(header.Linkname, spath); err != nil {
				return xerrors.Errorf("cannot create symbolic link: %w", err)
			}
		case tar.TypeLink:
			targetPath := path.Join(sandboxDir, header.Linkname)
			if err := os.Link(targetPath, spath); err != nil {
				return xerrors.Errorf("cannot create hard link: %w", err)
			}
		}
	}
	return nil
}
