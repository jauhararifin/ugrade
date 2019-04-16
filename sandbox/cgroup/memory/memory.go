package memory

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

// Limiter represent memory limiter.
type Limiter struct {
	cgroupPath   string
	cgroupName   string
	limit        uint64
	pollingDelay time.Duration
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
// TODO: also throttle swap memory
func (limiter *Limiter) Throttle(throttle uint64) error {
	// write memory throttle limit to `memory.limit_in_bytes` inside cgroup
	cgroupMemPath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName)
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", throttle).Debug("write memory throttle")
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "memory.limit_in_bytes"),
		[]byte(fmt.Sprintf("%d", throttle)),
		0700,
	); err != nil {
		return xerrors.Errorf("cannot write memory throttle to cgroup: %w", err)
	}
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", throttle).Debug("memory throttle set")

	return nil
}

// New create new implementation of `cgroup.Memory`
func New(cgroupPath, cgroupName string) *Limiter {
	instance := &Limiter{
		cgroupPath:   cgroupPath,
		cgroupName:   cgroupName,
		pollingDelay: 100 * time.Millisecond,
	}
	return instance
}
