package killer

import (
	"fmt"
	"os"
	"syscall"
	"time"

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
// TODO: ensure the process is killed. Just sleep for now.
func KillPids(pids []int) error {
	killed := false
	for i := 0; i < 10; i++ {
		for _, pid := range pids {
			syscall.Kill(pid, syscall.SIGKILL)
		}
		time.Sleep(100 * time.Millisecond)

		killed = true
		for _, pid := range pids {
			_, err := os.Stat(fmt.Sprintf("/proc/%d/stat", pid))
			if err == nil {
				killed = false
				break
			}
		}

		if killed {
			break
		}
	}
	if !killed {
		return errors.New("cannot kill pids after 10 times trying")
	}

	return nil
}
