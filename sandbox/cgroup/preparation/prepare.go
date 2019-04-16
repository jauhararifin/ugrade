package preparation

import (
	"fmt"
	"io"
	"os"
	"path"

	"github.com/jauhararifin/ugrade/sandbox/cgroup/killer"
	"github.com/sirupsen/logrus"
	"golang.org/x/xerrors"
)

// Prepare prepare cgroup directory to be ready for used by kills every process in it,
// and recreating the directory.
func Prepare(dir string) error {

	logrus.WithField("path", dir).Debug("check old cgroup")
	_, err := os.Stat(dir)
	if err != nil && !os.IsNotExist(err) {
		return xerrors.Errorf("cannot get info of cgroup path: %w", err)
	}

	// remove cgroup if already exists
	if err == nil {
		// get remaining processes in cgroups, by open cgroup.procs file.
		pfile, err := os.Open(path.Join(dir, "cgroup.procs"))
		if err != nil {
			return xerrors.Errorf("cannot open cgroup monitored processes: %w", err)
		}
		defer pfile.Close()

		// read process ids from cgroup.procs
		runningProcesses := make([]int, 0, 0)
		for {
			var proc int
			_, err := fmt.Fscan(pfile, &proc)
			if err == io.EOF {
				break
			}
			runningProcesses = append(runningProcesses, proc)
		}

		// kill processes.
		if len(runningProcesses) > 0 {
			logrus.WithField("pids", runningProcesses).Debug("killing dangling processes")
		}
		if err := killer.KillPids(runningProcesses); err != nil {
			return xerrors.Errorf("cannot kill processes: %w", err)
		}

		// removing directories
		logrus.WithField("path", dir).Debug("removing old cgroup")
		if err := os.RemoveAll(dir); err != nil {
			return xerrors.Errorf("cannot remove the old cgroup: %w", err)
		}
		logrus.WithField("path", dir).Debug("old cgroup removed")
	}

	// creating cgroup folder inside subsystem
	logrus.WithField("path", dir).Debug("creating cgroup directory")
	if err := os.MkdirAll(dir, 0755); err != nil {
		return xerrors.Errorf("cannot create cgroup directory: %w", err)
	}
	logrus.WithField("path", dir).Debug("cgroup directory created")

	return nil
}
