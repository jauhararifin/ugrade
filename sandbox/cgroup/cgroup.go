package cgroup

import (
	"context"
	"os"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/cgroup/cpu"
	"github.com/jauhararifin/ugrade/sandbox/cgroup/memory"
	"golang.org/x/xerrors"
)

// Limiter limit process resource using linux cgroup. Limiter gives context that will be cancelled when
// process inside cgroup exceeding limit.
type Limiter interface {
	Context() context.Context
	Prepare() error
	Put(process *os.Process) error
}

// CPU limit cpu usage of processes inside sandbox. This will monitor cpu usage, and kill
// process when cpu usage is exceeding limit. This will also cancel the context returned by `Context`
// method when processes inside cgroup exceeding limit.
type CPU interface {
	Limiter
	Limit(duration time.Duration) error
	Usage() time.Duration
}

// Memory limit memory usage of processes inside sandbox. This will monitor memory usage, and kill
// process when maximum memory usage is exceeding limit. This will also cancel the context returned by
// `Context` method when processes inside cgroup exceeding limit.
type Memory interface {
	Limiter
	Limit(bytes uint64) error
	Throttle(bytes uint64) error
	Usage() uint64
}

type defaultCgroup struct {
	path   string
	name   string
	cpu    CPU
	memory Memory
	err    error
}

func (dc *defaultCgroup) LimitCPU(duration time.Duration) error {
	return dc.cpu.Limit(duration)
}

func (dc *defaultCgroup) LimitMemory(bytes uint64) error {
	return dc.memory.Limit(bytes)
}

func (dc *defaultCgroup) ThrottleMemory(bytes uint64) error {
	return dc.memory.Throttle(bytes)
}

func (dc *defaultCgroup) Put(process *os.Process) error {
	if err := dc.memory.Put(process); err != nil {
		return err
	}
	return dc.cpu.Put(process)
}

func (dc *defaultCgroup) Monitor(ctx context.Context) context.Context {
	cpuContext := dc.cpu.Context()
	memContext := dc.memory.Context()
	cgctx, cancel := context.WithCancel(ctx)
	go func() {
		select {
		case <-cpuContext.Done():
			dc.err = ugrade.ErrTimeLimitExceeded
		case <-memContext.Done():
			dc.err = ugrade.ErrMemoryLimitExceeded
		case <-ctx.Done():
			dc.err = nil
		}
		cancel()
	}()

	return cgctx
}

func (dc *defaultCgroup) Usage() sandbox.CGroupUsage {
	return sandbox.CGroupUsage{
		Memory: dc.memory.Usage(),
		CPU:    dc.cpu.Usage(),
	}
}

func (dc *defaultCgroup) Error() error {
	return dc.err
}

// New create and initialize new default implementation of `sandbox.Cgroup`.
// TODO: search cgroup filesystem path.
func New(name string) (sandbox.CGroup, error) {
	instance := &defaultCgroup{
		path: "/sys/fs/cgroup",
		name: name,
	}

	instance.cpu = cpu.New(instance.path, instance.name)
	if err := instance.cpu.Prepare(); err != nil {
		return nil, xerrors.Errorf("cannot initialize cpu limiter: %w", err)
	}

	instance.memory = memory.New(instance.path, instance.name)
	if err := instance.memory.Prepare(); err != nil {
		return nil, xerrors.Errorf("cannot initialize memory limiter: %w", err)
	}

	return instance, nil
}
