package memory

import (
	"fmt"
	"io/ioutil"
	"os"
	"path"

	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

// Put will put `process` inside cgroup in memory subsystem. This basically declare that
// you want `process`'s memory usage to be monitored, throttled, and killed when exceeding
// the limit of `Limiter`.
func (limiter *Limiter) Put(process *os.Process) error {
	// assign current process to the cgroup that just created.
	cgroupMemPath := path.Join(limiter.cgroupPath, "memory", limiter.cgroupName)
	logrus.
		WithField("path", cgroupMemPath).
		WithField("pid", process.Pid).
		Debug("write process pid to cgroup.procs")
	if err := ioutil.WriteFile(
		path.Join(cgroupMemPath, "cgroup.procs"),
		[]byte(fmt.Sprintf("%d", process.Pid)),
		0700,
	); err != nil {
		return xerrors.Errorf("cannot put process to cgroup: %w", err)
	}
	logrus.
		WithField("path", cgroupMemPath).
		WithField("pid", process.Pid).
		Debug("process assigned to cgroup")

	limiter.processes = append(limiter.processes, process)

	return nil
}
