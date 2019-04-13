package killer

import (
	"os"
	"syscall"

	"github.com/pkg/errors"
)

// KillGroup kills processes that belong to `processes`'s group
func KillGroup(processes []*os.Process) error {
	killed := make(map[int]bool)
	for _, proc := range processes {
		pgid, err := syscall.Getpgid(proc.Pid)
		if err != nil {
			return errors.Wrapf(err, "cannot get pgid of %d", proc.Pid)
		}
		if killed[pgid] {
			continue
		}
		if err := syscall.Kill(-pgid, syscall.SIGKILL); err != nil {
			return errors.Wrapf(err, "cannot kill process %d", proc.Pid)
		}
		killed[pgid] = true
	}
	return nil
}

// KillPids kill all processes in `pids`
func KillPids(pids []int) error {
	for _, pid := range pids {
		syscall.Kill(pid, syscall.SIGKILL)
	}
	return nil
}
