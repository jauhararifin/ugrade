package memory

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// Limiter represent memory limiter.
type Limiter struct {
	cgroupPath   string
	cgroupName   string
	limit        uint64
	PollingDelay time.Duration
	usage        uint64

	processes []*os.Process
}

// Limit limit maximum memory usage of processes inside cgroup.
func (limiter *Limiter) Limit(bytes uint64) error {
	limiter.limit = bytes
	return nil
}

// Usage returns maximum memory usage.
func (limiter *Limiter) Usage() uint64 {
	return limiter.usage
}

// Throttle throttle memory usage of processes inside cgroup.
// Process will not killed when exceeding this limit.
func (limiter *Limiter) Throttle(throttle uint64) error {
	// write memory throttle limit to `memory.limit_in_bytes` inside cgroup
	cgroupMemPath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName)
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", throttle).Debug("write memory throttle")
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "memory.limit_in_bytes"),
		[]byte(fmt.Sprintf("%d", throttle)),
		0700,
	); err != nil {
		return errors.Wrap(err, "cannot write memory throttle to cgroup")
	}
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", throttle).Debug("memory throttle set")

	return nil
}

// New create new implementation of `cgroup.Memory`
func New(cgroupPath, cgroupName string) *Limiter {
	instance := &Limiter{
		cgroupPath:   cgroupPath,
		cgroupName:   cgroupName,
		PollingDelay: 100 * time.Millisecond,
	}
	return instance
}
