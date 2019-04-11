package cpu

import (
	"os"
	"time"
)

// Limiter limit cpu usage linux cgroup.
type Limiter struct {
	cgroupPath   string
	cgroupName   string
	limit        time.Duration
	PollingDelay time.Duration

	processes []*os.Process
}

// Limit set cpu limit in this cgroup.
func (limiter *Limiter) Limit(duration time.Duration) error {
	limiter.limit = duration
	return nil
}

// New create new CPULimiter
func New(cgroupPath string, cgroupName string) *Limiter {
	return &Limiter{
		cgroupPath:   cgroupPath,
		cgroupName:   cgroupName,
		PollingDelay: 100 * time.Millisecond,
	}
}
