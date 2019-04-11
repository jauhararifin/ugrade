package memory

import (
	"io/ioutil"
	"os"
	"path"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

const cgroupPath = "/sys/fs/cgroup/"

// Prepare create new cgroup tree inside memory subsystem. When old cgroup with same name already exists,
// it will be removed.
// TODO: use memory swap cgroup config
func (limiter *Limiter) Prepare() error {
	// remove old chroot if already exists
	cgroupMemPath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName)
	logrus.WithField("path", cgroupMemPath).Debug("check old cgroup of memory subsystem")
	_, err := os.Stat(cgroupMemPath)
	if err == nil {
		logrus.WithField("path", cgroupMemPath).Debug("removing old cgroup of memory subsystem")
		if err := os.RemoveAll(cgroupMemPath); err != nil {
			return errors.Wrap(err, "cannot remove the old cgroup")
		}
		logrus.WithField("path", cgroupMemPath).Debug("old cgroup of memory subsystem removed")
	}
	if err != nil && !os.IsNotExist(err) {
		return errors.Wrap(err, "cannot get info of cgroup memory path")
	}

	// creating cgroup folder inside memory subsystem
	logrus.WithField("path", cgroupMemPath).Debug("creating cgroup for memory subsystem")
	if err := os.MkdirAll(cgroupMemPath, 0755); err != nil {
		return errors.Wrapf(err, "cannot create %s memory subsystem cgroup", limiter.cgroupName)
	}
	logrus.WithField("path", cgroupMemPath).Debug("cgroup for memory subsystem created")

	// reset max usage to zero
	logrus.WithField("path", cgroupMemPath).Debug("set memory max usage to zero")
	if err := ioutil.WriteFile(path.Join(cgroupMemPath, "memory.max_usage_in_bytes"), []byte("0"), 0755); err != nil {
		return errors.Wrap(err, "cannot set max usage to zero")
	}
	logrus.WithField("path", cgroupMemPath).Debug("memory max usage set to zero")

	return nil
}
