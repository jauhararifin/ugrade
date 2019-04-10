package cpu

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
	cgroupUsagePath := path.Join(cgroupPath, "cpuacct", limiter.Name, "cpuacct.usage")
	logrus.WithField("path", cgroupUsagePath).Trace("read cpu usage from cgroup directory")
	usageBytes, err := ioutil.ReadFile(cgroupUsagePath)
	if err != nil {
		logrus.Debug(err)
		return errors.Wrap(err, "cannot read cpuacct.usage file from cgroup directory")
	}

	var usage uint64
	fmt.Sscanf(string(usageBytes), "%d", &usage)
	logrus.
		WithField("usage", time.Duration(usage)*time.Nanosecond).
		WithField("limit", limiter.Limit).
		Trace("cpu usage read")

	if time.Duration(usage)*time.Nanosecond > limiter.Limit {
		return ErrTimeLimitExceeded
	}

	return nil
}

// Context takes a context and return new context that cancelled when the cpu usage of
// processes exceeding the limit.
func (limiter *Limiter) Context(ctx context.Context) context.Context {
	memctx, cancel := context.WithCancel(ctx)

	pollTicker := time.NewTicker(pollingDelay)
	go func() {
		for {
			select {
			case <-pollTicker.C:
				err := limiter.ensure()
				if errors.Cause(err) == ErrTimeLimitExceeded {
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
