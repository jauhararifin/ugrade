package sandbox

import (
	"context"
	"os"
	"time"
)

// CGroup limits processes's memory and cpu usage using linux cgroup.
type CGroup interface {
	ThrottleMemory(bytes uint64) error
	LimitMemory(bytes uint64) error
	LimitCPU(duration time.Duration) error

	Put(process *os.Process) error

	Monitor(ctx context.Context) context.Context

	Usage() Usage
	Error() error
}
