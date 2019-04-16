package memory

import (
	"context"
	"fmt"
	"io/ioutil"
	"os"
	"path"
	"time"

	"github.com/jauhararifin/ugrade"

	"github.com/jauhararifin/ugrade/sandbox/cgroup/killer"
	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

func (limiter *Limiter) currentUsed() (uint64, error) {
	cgroupUsagePath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName, "memory.usage_in_bytes")
	logrus.WithField("path", cgroupUsagePath).Trace("read memory usage from cgroup directory")
	usageBytes, err := ioutil.ReadFile(cgroupUsagePath)
	if err != nil {
		return 0, xerrors.Errorf("cannot read memory.usage_in_bytes file from cgroup directory: %w", err)
	}
	var totalUsed uint64
	fmt.Sscanf(string(usageBytes), "%d", &totalUsed)
	return totalUsed, nil
}

func (limiter *Limiter) currentCachedPageSize() (uint64, error) {
	cgroupStatPath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName, "memory.stat")
	logrus.WithField("path", cgroupStatPath).Trace("read memory stat from cgroup directory")
	f, err := os.Open(cgroupStatPath)
	if err != nil {
		return 0, xerrors.Errorf("cannot read memory.stat file from cgroup directory: %w", err)
	}
	var cachedPgSz uint64
	defer f.Close()
	for {
		var s string
		var val uint64
		if _, err := fmt.Fscanf(f, "%s %d\n", &s, &val); err != nil {
			break
		}
		if s == "cache" {
			cachedPgSz = val
			break
		}
	}
	return cachedPgSz, nil
}

func (limiter *Limiter) ensure() error {
	// read memory usage from `memory.usage_in_bytes`
	totalUsed, err := limiter.currentUsed()
	if err != nil {
		return xerrors.Errorf("cannot get current memory usage: %w", err)
	}

	// get cached page size by read memory status from `memory.stat`
	cachedPgSz, err := limiter.currentCachedPageSize()
	if err != nil {
		return xerrors.Errorf("cannot get current cached page size: %w", err)
	}

	currentUsage := totalUsed - cachedPgSz
	if currentUsage > limiter.usage {
		limiter.usage = currentUsage
	}
	logrus.
		WithField("totalUsed", totalUsed).
		WithField("cachedPage", cachedPgSz).
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
