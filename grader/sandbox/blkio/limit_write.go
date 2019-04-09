package blkio

import (
	"bufio"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path"
	"strings"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

// LimitWrite make limiter for file writing in bytes per second. `file` should contain absolute path to host filesystem.
func (limiter *Limiter) LimitWrite(file string, bps uint64) error {
	logrus.Debug("open /proc/self/mountinfo")
	mountInfoF, err := os.Open("/proc/self/mountinfo")
	if err != nil {
		return errors.Wrap(err, "cannot open mount info file")
	}

	logrus.Debug("parsing /proc/self/mountinfo file")
	mountReader := bufio.NewReader(mountInfoF)
	device := ""
	for {
		line, err := mountReader.ReadString('\n')
		if err == io.EOF {
			break
		} else if err != nil {
			return errors.Wrap(err, "cannot read mountinfo file")
		}
		var dummy, majorMinor, mountPoint string
		if _, err := fmt.Sscanf(line, "%s %s %s %s %s", &dummy, &dummy, &majorMinor, &dummy, &mountPoint); err != nil {
			continue
		}
		logrus.WithField("major:minor", majorMinor).WithField("mountPoint", mountPoint).Trace("mount device found")

		if strings.HasPrefix(file, mountPoint) {
			logrus.WithField("major:minor", majorMinor).WithField("mountPoint", mountPoint).Trace("using this device")
			device = majorMinor
			break
		}
	}

	if len(device) == 0 {
		return errors.New("cannot find device file")
	}

	// write blkio write throttle limit to `blkio.throttle.write_bps_device` inside cgroup
	cgroupBlkioPath := path.Join(cgroupPath, "blkio", limiter.Name)
	logrus.WithField("path", cgroupBlkioPath).WithField("bps", bps).Debug("write blkio write throttle")
	if err := ioutil.WriteFile(
		path.Join(cgroupBlkioPath, "blkio.throttle.write_bps_device"),
		[]byte(fmt.Sprintf("%s %d", device, bps)),
		0700,
	); err != nil {
		return errors.Wrap(err, "cannot write blkio throttle to cgroup")
	}
	logrus.WithField("path", cgroupBlkioPath).WithField("bps", bps).Debug("blkio throttle set")

	return nil
}
