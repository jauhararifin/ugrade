package sandbox

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

const cgroupPath = "/sys/fs/cgroup/"
const memoryPollingDelay = 100 // how fast we poll the memory usage, in milisecond

func (sb *defaultSandbox) prepareMemoryCgroup(ctx context.Context, cmd Command) error {
	// remove old chroot if already exists
	cgroupMemPath := path.Join(cgroupPath, "memory", "ugrade-sandbox")
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
		return errors.Wrap(err, "cannot create ugrade-sandbox memory subsystem cgroup")
	}
	logrus.WithField("path", cgroupMemPath).Debug("cgroup for memory subsystem created")

	// write memory throttle limit to `memory.limit_in_bytes` inside cgroup
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", cmd.MemoryThrottle).Debug("write memory throttle")
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "memory.limit_in_bytes"),
		[]byte(fmt.Sprintf("%d", cmd.MemoryThrottle)),
		0700,
	); err != nil {
		return errors.Wrap(err, "cannot write memory throttle to cgroup")
	}
	logrus.WithField("path", cgroupMemPath).WithField("memoryThrottle", cmd.MemoryThrottle).Debug("memory throttle set")

	return nil
}

func (sb *defaultSandbox) assignProcessToMemory(pid int) error {
	// assign current process to the cgroup that just created.
	cgroupMemPath := path.Join(cgroupPath, "memory", "ugrade-sandbox")
	logrus.
		WithField("path", cgroupMemPath).
		WithField("pid", pid).
		Debug("write process pid to cgroup.procs")
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "cgroup.procs"),
		[]byte(fmt.Sprintf("%d", pid)),
		0700,
	); err != nil {
		return errors.Wrap(err, "cannot put process to cgroup")
	}
	logrus.
		WithField("path", cgroupMemPath).
		WithField("pid", pid).
		Debug("process assgined to cgroup")

	return nil
}

func (sb *defaultSandbox) ensureMemoryLimit(ctx context.Context, cmd Command) error {
	cgroupMaxUsagePath := path.Join(cgroupPath, "memory", "ugrade-sandbox", "memory.max_usage_in_bytes")
	logrus.WithField("path", cgroupMaxUsagePath).Trace("read max memory usage from cgroup directory")
	maxUsageBytes, err := ioutil.ReadFile(cgroupMaxUsagePath)
	if err != nil {
		logrus.Debug(err)
		return errors.Wrap(err, "cannot read memory.max_usage_in_bytes file from cgroup directory")
	}

	var maxUsage uint32
	fmt.Sscanf(string(maxUsageBytes), "%d", &maxUsage)
	logrus.
		WithField("mypid", os.Getpid()).
		WithField("maxUsage", maxUsage).
		WithField("memoryLimit", cmd.MemoryLimit).
		WithField("memoryThrottle", cmd.MemoryThrottle).
		Trace("maximum memory usage read")

	if maxUsage > cmd.MemoryLimit {
		return ErrMemoryLimitExceeded
	}

	return nil
}

func (sb *defaultSandbox) monitorMemoryLimit(ctx context.Context, cmd Command) context.Context {
	memctx, cancel := context.WithCancel(ctx)

	pollTicker := time.NewTicker(time.Duration(memoryPollingDelay) * time.Millisecond)
	go func() {
		for {
			select {
			case <-pollTicker.C:
				err := sb.ensureMemoryLimit(memctx, cmd)
				if errors.Cause(err) == ErrMemoryLimitExceeded {
					cancel()
					return
				}
			case <-ctx.Done():
				cancel()
				return
			}
		}
	}()

	return memctx
}
