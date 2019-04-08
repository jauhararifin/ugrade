package sandbox

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

type defaultSandbox struct {
	workingDir string
	sandboxDir string
}

func (sb *defaultSandbox) getInstallDir() (string, error) {
	// TODO: use other dir for install dir instead of `homedir`/.ugrade
	return sb.getConfigDir()
}

func (sb *defaultSandbox) getConfigDir() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", errors.Wrap(err, "cannot get current user home directory")
	}
	return path.Join(homeDir, ".ugrade"), nil
}

func (sb *defaultSandbox) assertWorkingDir() (string, error) {
	if len(sb.workingDir) > 0 {
		return sb.workingDir, nil
	}

	workingDir := ""

	// reading working directory from config file
	configDir, err := sb.getConfigDir()
	if err != nil {
		return "", errors.Wrap(err, "cannot get configuration directory")
	}
	workingDirConf := path.Join(configDir, "workingDir")
	logrus.WithField("workingDirConf", workingDirConf).Debug("read working directory from configuration file")
	pathBytes, err := ioutil.ReadFile(workingDirConf)
	if err == nil {
		workingDir = string(pathBytes)
		logrus.WithField("workingDir", workingDir).Debug("try using working directory from configuration file")
	} else {
		logrus.WithField("error", err).Warn("cannot read working directory configuration file")
	}

	// check if working dir is valid
	if len(workingDir) > 0 {
		info, err := os.Stat(workingDir)
		if err == nil && info.IsDir() {
			sb.workingDir = workingDir
			return workingDir, nil
		}
		logrus.WithField("error", err).Warn("working directory is invalid")
	}

	// create working directory
	logrus.Info("creating working directory")
	workingDir, err = ioutil.TempDir("", "ugrade")
	if err != nil {
		return "", errors.Wrap(err, "cannot create working directory")
	}
	sb.workingDir = workingDir
	logrus.WithField("workingDir", workingDir).Info("working directory created")

	// save working directory path to configuration file
	logrus.Debug("saving working directory to configuration file")
	if err := ioutil.WriteFile(workingDirConf, []byte(workingDir), 766); err != nil {
		return "", errors.Wrap(err, "cannot save current working directory to config file")
	}
	logrus.WithField("workingDirConf", workingDirConf).Debug("working directory saved to configuration file")

	return workingDir, nil
}

func (sb *defaultSandbox) extractImage(imagePath string, sandboxDir string) error {
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

func (sb *defaultSandbox) assertSandboxDir() (string, error) {
	if len(sb.sandboxDir) > 0 {
		return sb.sandboxDir, nil
	}

	// get working directory
	workingDir, err := sb.assertWorkingDir()
	if err != nil {
		return "", errors.Wrap(err, "cannot get working directory")
	}

	// check if sandbox directory already exists
	sandboxDir := path.Join(workingDir, "sandbox")
	info, err := os.Stat(sandboxDir)
	if err == nil && info.IsDir() {
		sb.sandboxDir = sandboxDir
		return sandboxDir, nil
	}
	logrus.WithField("error", err).Warn("sandbox directory is invalid")

	// create sandbox directory
	logrus.Info("creating sandbox directory")
	if err := os.Mkdir(sandboxDir, 0700); err != nil {
		return "", errors.Wrap(err, "cannot create sandbox directory")
	}
	logrus.WithField("sandboxDir", sandboxDir).Info("sandbox directory created")

	// get image path
	logrus.Info("searching image file")
	installDir, err := sb.getInstallDir()
	if err != nil {
		return "", errors.Wrap(err, "cannot get installation directory")
	}
	imagePath := path.Join(installDir, "image.tar.xz")
	logrus.WithField("imagePath", imagePath).Info("image file found")

	// extracting image
	if err := sb.extractImage(imagePath, sandboxDir); err != nil {
		return "", errors.Wrap(err, "cannot extract image")
	}

	sb.sandboxDir = sandboxDir
	return sandboxDir, nil
}

func (sb *defaultSandbox) configure() error {
	if _, err := sb.assertWorkingDir(); err != nil {
		return errors.Wrap(err, "error initializing working directory")
	}
	if _, err := sb.assertSandboxDir(); err != nil {
		return errors.Wrap(err, "error initializing sandbox directory")
	}
	return nil
}

// New create new default implementation of `sandbox.Sandbox`
func New() (Sandbox, error) {
	sbox := &defaultSandbox{}
	if err := sbox.configure(); err != nil {
		return nil, errors.Wrap(err, "cannot initialize sandbox configuration")
	}
	return sbox, nil
}
