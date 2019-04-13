package cpu

import (
	"io/ioutil"
	"path"

	"github.com/jauhararifin/ugrade/sandbox/cgroup/preparation"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// Prepare create new cgroup tree inside cpuacct subsystem. When old cgroup with same name already exists,
// it will be removed.
func (limiter *Limiter) Prepare() error {
	// remove old chroot if already exists
	cgroupCPUPath := path.Join(limiter.cgroupPath, "cpuacct", limiter.cgroupName)
	if err := preparation.Prepare(cgroupCPUPath); err != nil {
		return errors.Wrap(err, "cannot prepare cgroup folder for cpu subsystem")
	}

	// set cpu usage to zero
	logrus.WithField("path", cgroupCPUPath).Debug("setting cpu usage to zero")
	if err := ioutil.WriteFile(path.Join(cgroupCPUPath, "cpuacct.usage"), []byte("0"), 0755); err != nil {
		return errors.Wrap(err, "cannot set cpu usage to zero")
	}
	logrus.WithField("path", cgroupCPUPath).Debug("cpu usage set to zero")

	return nil
}
