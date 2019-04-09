package blkio

import (
	"syscall"

	"github.com/pkg/errors"
)

// LimitSize make limiter for file size. This will kill process when file size exceeding the limit.
func (limiter *Limiter) LimitSize(size uint64) error {
	var rLimit syscall.Rlimit
	err := syscall.Getrlimit(syscall.RLIMIT_FSIZE, &rLimit)
	if err != nil {
		return errors.Wrap(err, "cannot get rlimit file size")
	}

	rLimit.Max = size
	rLimit.Cur = size

	if err := syscall.Setrlimit(syscall.RLIMIT_FSIZE, &rLimit); err != nil {
		return errors.Wrap(err, "cannot set file size rlimit")
	}

	return nil
}
