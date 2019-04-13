package memory

import (
	"context"
	"fmt"
	"io/ioutil"
	"path"
	"time"

	"github.com/jauhararifin/ugrade/sandbox/cgroup/killer"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// ErrMemLimit indicates that process maximum memory usage is exceeding the limit.
var ErrMemLimit = errors.New("process's memory limit exceeded")

func (limiter *Limiter) ensure() error {
	cgroupMaxUsagePath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName, "memory.max_usage_in_bytes")
	logrus.WithField("path", cgroupMaxUsagePath).Trace("read max memory usage from cgroup directory")
	maxUsageBytes, err := ioutil.ReadFile(cgroupMaxUsagePath)
	if err != nil {
		logrus.Debug(err)
		return errors.Wrap(err, "cannot read memory.max_usage_in_bytes file from cgroup directory")
	}

	fmt.Sscanf(string(maxUsageBytes), "%d", &limiter.usage)
	logrus.
		WithField("maxUsage", limiter.usage).
		WithField("memoryLimit", limiter.limit).
		Trace("maximum memory usage read")

	if limiter.usage > limiter.limit {
		return ErrMemLimit
	}

	return nil
}

// Context takes a context and return new context that cancelled when the total memory usage of
// processes exceeding the limit.
func (limiter *Limiter) Context() context.Context {
	memctx, cancel := context.WithCancel(context.Background())

	pollTicker := time.NewTicker(limiter.PollingDelay)
	go func() {
		for {
			<-pollTicker.C
			err := limiter.ensure()
			if errors.Cause(err) == ErrMemLimit {
				if err := killer.KillGroup(limiter.processes); err != nil {
					logrus.Error(err) // dont know how to handle, just log it
				}
				cancel()
				return
			}
		}
	}()

	return memctx
}
