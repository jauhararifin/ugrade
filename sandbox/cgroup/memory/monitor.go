package memory

import (
	"context"
	"fmt"
	"io/ioutil"
	"path"
	"time"

	"github.com/jauhararifin/ugrade"

	"github.com/jauhararifin/ugrade/sandbox/cgroup/killer"
	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

func (limiter *Limiter) ensure() error {
	cgroupMaxUsagePath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName, "memory.max_usage_in_bytes")
	logrus.WithField("path", cgroupMaxUsagePath).Trace("read max memory usage from cgroup directory")
	maxUsageBytes, err := ioutil.ReadFile(cgroupMaxUsagePath)
	if err != nil {
		return xerrors.Errorf("cannot read memory.max_usage_in_bytes file from cgroup directory: %w", err)
	}

	fmt.Sscanf(string(maxUsageBytes), "%d", &limiter.usage)
	logrus.
		WithField("maxUsage", limiter.usage).
		WithField("memoryLimit", limiter.limit).
		Trace("maximum memory usage read")

	if limiter.usage > limiter.limit {
		return ugrade.ErrMemoryLimitExceeded
	}

	return nil
}

// Context return new context that cancelled when the total memory usage of processes exceeding the limit.
func (limiter *Limiter) Context() context.Context {
	memctx, cancel := context.WithCancel(context.Background())

	pollTicker := time.NewTicker(limiter.pollingDelay)
	go func() {
		for {
			<-pollTicker.C
			err := limiter.ensure()
			if xerrors.Is(err, ugrade.ErrMemoryLimitExceeded) {
				if err := killer.KillGroup(limiter.processes); err != nil {
					// dont know how to handle, just log it
					logrus.WithField("error", err).Error("cannot clean process by killing")
				}
				cancel()
				return
			}
		}
	}()

	return memctx
}
