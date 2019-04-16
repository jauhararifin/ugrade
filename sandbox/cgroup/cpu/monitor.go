package cpu

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

func (limiter *Limiter) readUsage() (uint64, error) {
	cgroupUsagePath := path.Join(limiter.cgroupPath, "cpuacct", limiter.cgroupName, "cpuacct.usage")
	logrus.WithField("path", cgroupUsagePath).Trace("read cpu usage from cgroup directory")
	usageBytes, err := ioutil.ReadFile(cgroupUsagePath)
	if err != nil {
		return 0, xerrors.Errorf("cannot read cpuacct.usage file from cgroup directory: %w", err)
	}

	var usage uint64
	fmt.Sscanf(string(usageBytes), "%d", &usage)
	logrus.
		WithField("usage", time.Duration(usage)*time.Nanosecond).
		WithField("limit", limiter.Limit).
		Trace("cpu usage read")

	return usage, nil
}

func (limiter *Limiter) ensure() error {
	usage, err := limiter.readUsage()
	if err != nil {
		return xerrors.Errorf("cannot read cpu usage: %w", err)
	}

	limiter.usage = time.Duration(usage) * time.Nanosecond
	if limiter.usage > limiter.limit {
		return ugrade.ErrTimeLimitExceeded
	}

	return nil
}

// Context return new context that cancelled when the cpu usage of processes exceeding the limit.
func (limiter *Limiter) Context() context.Context {
	memctx, cancel := context.WithCancel(context.Background())

	waitfirst := time.After(limiter.limit)
	go func() {
		<-waitfirst
		pollTicker := time.NewTicker(limiter.PollingDelay)
		for {
			<-pollTicker.C
			err := limiter.ensure()
			if xerrors.Is(err, ugrade.ErrTimeLimitExceeded) {
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
