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

// ErrTimeLimit indicates that process's cpu usage exceeding time limit.
var ErrTimeLimit = errors.New("process's time limit exceeded")

func (limiter *Limiter) ensure() error {
	cgroupUsagePath := path.Join(limiter.cgroupPath, "cpuacct", limiter.cgroupName, "cpuacct.usage")
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

	if time.Duration(usage)*time.Nanosecond > limiter.limit {
		return ErrTimeLimit
	}

	return nil
}

// Context takes a context and return new context that cancelled when the cpu usage of
// processes exceeding the limit.
func (limiter *Limiter) Context() context.Context {
	memctx, cancel := context.WithCancel(context.Background())

	pollTicker := time.NewTicker(limiter.PollingDelay)
	go func() {
		for {
			<-pollTicker.C
			err := limiter.ensure()
			if errors.Cause(err) == ErrTimeLimit {
				cancel()
				return
			}
		}
	}()

	return memctx
}
