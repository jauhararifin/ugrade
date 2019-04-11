package rlimit

import (
	"syscall"

	"github.com/pkg/errors"
)

// Set set rlimit of current process
func Set(rlimitType int, cur, max uint64) error {
	var rLimit syscall.Rlimit
	err := syscall.Getrlimit(rlimitType, &rLimit)
	if err != nil {
		return errors.Wrap(err, "cannot get rlimit")
	}

	rLimit.Max = max
	rLimit.Cur = cur

	if err := syscall.Setrlimit(rlimitType, &rLimit); err != nil {
		return errors.Wrap(err, "cannot set rlimit")
	}

	return nil
}

// LimitOpenFile limit the number of open file of current processs.
func LimitOpenFile(nopenfile uint64) error {
	err := Set(syscall.RLIMIT_NOFILE, nopenfile, nopenfile)
	return errors.Wrap(err, "cannot set number of open file limit")
}

// LimitFSize limit the size of file generated by current process.
func LimitFSize(fsize uint64) error {
	err := Set(syscall.RLIMIT_FSIZE, fsize, fsize)
	return errors.Wrap(err, "cannot set number of open file limit")
}