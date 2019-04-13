package preparation

import (
	"fmt"
	"io"
	"os"
	"path"

	"github.com/jauhararifin/ugrade/sandbox/cgroup/killer"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// Prepare prepare cgroup directory to be ready for used by kills every process in it,
// and recreating the directory.
func Prepare(dir string) error {
	logrus.WithField("path", dir).Debug("check old cgroup")
	_, err := os.Stat(dir)
	if err == nil {
		// kill remaining processes
		pfile, err := os.Open(path.Join(dir, "cgroup.procs"))
		if err != nil {
			return errors.Wrap(err, "cannot open cgroup monitored processes")
		}
		defer pfile.Close()
		runningProcesses := make([]int, 0, 0)
		for {
			var proc int
			_, err := fmt.Fscan(pfile, &proc)
			if err == io.EOF {
				break
			}
			runningProcesses = append(runningProcesses, proc)
		}
		if len(runningProcesses) > 0 {
			logrus.WithField("pids", runningProcesses).Debug("killing dangling processes")
		}
		if err := killer.KillPids(runningProcesses); err != nil {
			return errors.Wrap(err, "cannot kill processes")
		}

		// removing directories
		logrus.WithField("path", dir).Debug("removing old cgroup")
		if err := os.RemoveAll(dir); err != nil {
			return errors.Wrap(err, "cannot remove the old cgroup")
		}
		logrus.WithField("path", dir).Debug("old cgroup removed")
	}
	if err != nil && !os.IsNotExist(err) {
		return errors.Wrap(err, "cannot get info of cgroup path")
	}

	// creating cgroup folder inside subsystem
	logrus.WithField("path", dir).Debug("creating cgroup")
	if err := os.MkdirAll(dir, 0755); err != nil {
		return errors.Wrapf(err, "cannot create cgroup")
	}
	logrus.WithField("path", dir).Debug("cgroup created")

	return nil
}
