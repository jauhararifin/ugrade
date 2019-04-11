package cpu

import (
	"io/ioutil"
	"os"
	"path"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// Prepare create new cgroup tree inside cpuacct subsystem. When old cgroup with same name already exists,
// it will be removed.
func (limiter *Limiter) Prepare() error {
	// remove old chroot if already exists
	cgroupCPUPath := path.Join(limiter.cgroupPath, "cpuacct", limiter.cgroupName)
	logrus.WithField("path", cgroupCPUPath).Debug("check old cgroup of cpuacct subsystem")
	_, err := os.Stat(cgroupCPUPath)
	if err == nil {
		logrus.WithField("path", cgroupCPUPath).Debug("removing old cgroup of cpuacct subsystem")
		if err := os.RemoveAll(cgroupCPUPath); err != nil {
			return errors.Wrap(err, "cannot remove the old cgroup")
		}
		logrus.WithField("path", cgroupCPUPath).Debug("old cgroup of cpuacct subsystem removed")
	}
	if err != nil && !os.IsNotExist(err) {
		return errors.Wrap(err, "cannot get info of cgroup cpuacct path")
	}

	// creating cgroup folder inside cpuacct subsystem
	logrus.WithField("path", cgroupCPUPath).Debug("creating cgroup for cpuacct subsystem")
	if err := os.MkdirAll(cgroupCPUPath, 0755); err != nil {
		return errors.Wrapf(err, "cannot create %s cpuacct subsystem cgroup", limiter.cgroupName)
	}
	logrus.WithField("path", cgroupCPUPath).Debug("cgroup for cpuacct subsystem created")

	// set cpu usage to zero
	logrus.WithField("path", cgroupCPUPath).Debug("setting cpu usage to zero")
	if err := ioutil.WriteFile(path.Join(cgroupCPUPath, "cpuacct.usage"), []byte("0"), 0755); err != nil {
		return errors.Wrap(err, "cannot set cpu usage to zero")
	}
	logrus.WithField("path", cgroupCPUPath).Debug("cpu usage set to zero")

	return nil
}
