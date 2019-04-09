package memory

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

const cgroupPath = "/sys/fs/cgroup/"

// Prepare create new cgroup tree inside memory subsystem. When old cgroup with same name already exists,
// it will be removed.
func (limiter *Limiter) Prepare() error {
	// remove old chroot if already exists
	cgroupMemPath := path.Join(cgroupPath, "memory", limiter.Name)
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
		return errors.Wrapf(err, "cannot create %s memory subsystem cgroup", limiter.Name)
	}
	logrus.WithField("path", cgroupMemPath).Debug("cgroup for memory subsystem created")

	// write memory throttle limit to `memory.limit_in_bytes` inside cgroup
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", limiter.Throttle).Debug("write memory throttle")
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "memory.limit_in_bytes"),
		[]byte(fmt.Sprintf("%d", limiter.Throttle)),
		0700,
	); err != nil {
		return errors.Wrap(err, "cannot write memory throttle to cgroup")
	}
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", limiter.Throttle).Debug("memory throttle set")

	return nil
}
