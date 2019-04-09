package blkio

import (
	"os"
	"path"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

const cgroupPath = "/sys/fs/cgroup/"

// Prepare create new cgroup tree inside blkio subsystem. When old cgroup with same name already exists,
// it will be removed.
func (limiter *Limiter) Prepare() error {
	// remove old chroot if already exists
	cgroupBlkioPath := path.Join(cgroupPath, "blkio", limiter.Name)
	logrus.WithField("path", cgroupBlkioPath).Debug("check old cgroup of blkio subsystem")
	_, err := os.Stat(cgroupBlkioPath)
	if err == nil {
		logrus.WithField("path", cgroupBlkioPath).Debug("removing old cgroup of blkio subsystem")
		if err := os.RemoveAll(cgroupBlkioPath); err != nil {
			return errors.Wrap(err, "cannot remove the old cgroup")
		}
		logrus.WithField("path", cgroupBlkioPath).Debug("old cgroup of blkio subsystem removed")
	}
	if err != nil && !os.IsNotExist(err) {
		return errors.Wrap(err, "cannot get info of cgroup blkio path")
	}

	// creating cgroup folder inside blkio subsystem
	logrus.WithField("path", cgroupBlkioPath).Debug("creating cgroup for blkio subsystem")
	if err := os.MkdirAll(cgroupBlkioPath, 0755); err != nil {
		return errors.Wrapf(err, "cannot create %s blkio subsystem cgroup", limiter.Name)
	}
	logrus.WithField("path", cgroupBlkioPath).Debug("cgroup for blkio subsystem created")

	return nil
}
