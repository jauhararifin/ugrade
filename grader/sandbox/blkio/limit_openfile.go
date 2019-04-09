package blkio

import (
	"syscall"

	"github.com/pkg/errors"
)

// LimitOpenFile limit process open file.
func (limiter *Limiter) LimitOpenFile(nopenfile uint64) error {
	var rLimit syscall.Rlimit
	err := syscall.Getrlimit(syscall.RLIMIT_NOFILE, &rLimit)
	if err != nil {
		return errors.Wrap(err, "cannot get rlimit open file")
	}

	rLimit.Max = nopenfile
	rLimit.Cur = nopenfile

	if err := syscall.Setrlimit(syscall.RLIMIT_NOFILE, &rLimit); err != nil {
		return errors.Wrap(err, "cannot set open file rlimit")
	}

	return nil
}
