package memory

import (
	"context"
	"fmt"
	"io/ioutil"
	"path"
	"time"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (limiter *Limiter) ensure() error {
	cgroupMaxUsagePath := path.Join(cgroupPath, "memory", limiter.Name, "memory.max_usage_in_bytes")
	logrus.WithField("path", cgroupMaxUsagePath).Trace("read max memory usage from cgroup directory")
	maxUsageBytes, err := ioutil.ReadFile(cgroupMaxUsagePath)
	if err != nil {
		logrus.Debug(err)
		return errors.Wrap(err, "cannot read memory.max_usage_in_bytes file from cgroup directory")
	}

	var maxUsage uint64
	fmt.Sscanf(string(maxUsageBytes), "%d", &maxUsage)
	logrus.
		WithField("maxUsage", maxUsage).
		WithField("memoryLimit", limiter.Limit).
		WithField("memoryThrottle", limiter.Throttle).
		Trace("maximum memory usage read")

	if maxUsage > limiter.Limit {
		return ErrMemoryLimitExceeded
	}

	return nil
}

// Context takes a context and return new context that cancelled when the total memory usage of
// processes exceeding the limit.
func (limiter *Limiter) Context(ctx context.Context) context.Context {
	memctx, cancel := context.WithCancel(ctx)

	pollTicker := time.NewTicker(time.Duration(memoryPollingDelay) * time.Millisecond)
	go func() {
		for {
			select {
			case <-pollTicker.C:
				err := limiter.ensure()
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
