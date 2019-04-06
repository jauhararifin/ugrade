package worker

import (
	"archive/tar"
	"io"
	"io/ioutil"
	"os"
	"path"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/xi2/xz"
)

func (wk *defaultWorker) getInstallDir() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", errors.Wrap(err, "cannot get current user home directory")
	}
	return path.Join(homeDir, ".ugrade"), nil
}

func (wk *defaultWorker) assertWorkingDir() (string, error) {
	if len(wk.workingDir) > 0 {
		return wk.workingDir, nil
	}

	logrus.Info("creating working directory...")
	workingDir, err := ioutil.TempDir("", "ugrade")
	if err != nil {
		return "", errors.Wrap(err, "cannot create working directory")
	}
	wk.workingDir = workingDir
	logrus.WithField("workingDir", workingDir).Info("working directory created")
	return workingDir, nil
}

func (wk *defaultWorker) extractImage(imagePath string, sandboxDir string) error {
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

		path := path.Join(sandboxDir, header.Name)
		switch header.Typeflag {
		case tar.TypeDir:
			err = os.MkdirAll(path, 0700)
			if err != nil {
				return errors.Wrap(err, "cannot create directory")
			}
		case tar.TypeReg, tar.TypeRegA:
			w, err := os.Create(path)
			if err != nil {
				return errors.Wrap(err, "cannot create file")
			}
			_, err = io.Copy(w, tarReader)
			if err != nil {
				return errors.Wrap(err, "cannot write file")
			}
			w.Close()
		}
	}
	return nil
}

func (wk *defaultWorker) assertRootFSDir() (string, error) {
	if len(wk.rootFSDir) > 0 {
		return wk.rootFSDir, nil
	}

	// get working directory
	workingDir, err := wk.assertWorkingDir()
	if err != nil {
		return "", errors.Wrap(err, "cannot get working directory")
	}

	// get sandbox directory
	logrus.Info("creating sandbox directory")
	sandboxDir := path.Join(workingDir, "sandbox")
	if err := os.Mkdir(sandboxDir, 0700); err != nil {
		return "", errors.Wrap(err, "cannot create sandbox directory")
	}
	logrus.WithField("sandboxDir", sandboxDir).Info("sandbox directory created")

	// get image path
	logrus.Info("searching image file")
	installDir, err := wk.getInstallDir()
	if err != nil {
		return "", errors.Wrap(err, "cannot get installation directory")
	}
	imagePath := path.Join(installDir, "image.tar.xz")
	logrus.WithField("imagePath", imagePath).Info("image file found")

	// extracting image
	if err := wk.extractImage(imagePath, sandboxDir); err != nil {
		return "", errors.Wrap(err, "cannot extract image")
	}

	return sandboxDir, nil
}
