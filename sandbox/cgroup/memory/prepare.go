package memory

import (
	"io/ioutil"
	"path"

	"github.com/jauhararifin/ugrade/sandbox/cgroup/preparation"
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
	if err := preparation.Prepare(cgroupMemPath); err != nil {
		return errors.Wrap(err, "cannot prepare cgroup folder for memory subsystem")
	}

	// reset max usage to zero
	logrus.WithField("path", cgroupMemPath).Debug("set memory max usage to zero")
	if err := ioutil.WriteFile(path.Join(cgroupMemPath, "memory.max_usage_in_bytes"), []byte("0"), 0755); err != nil {
		return errors.Wrap(err, "cannot set max usage to zero")
	}
	logrus.WithField("path", cgroupMemPath).Debug("memory max usage set to zero")

	return nil
}
