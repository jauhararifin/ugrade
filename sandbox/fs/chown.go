package fs

import (
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
)

func (*defaultFS) chownDir(dir string, uid, gid int) error {
	filepath.Walk(dir, func(name string, info os.FileInfo, err error) error {
		if err == nil {
			if (info.Mode() & os.ModeSymlink) != 0 {
				newname, err := os.Readlink(name)
				if err != nil {
					logrus.WithField("name", name).Warn("error chowning file")
				}

				if strings.HasPrefix(newname, "/") {
					name = path.Join(dir, newname)
				} else {
					name = path.Join(filepath.Dir(name), newname)
				}
			}

			err := os.Chown(name, uid, gid)
			if err != nil {
				logrus.Warn(errors.Wrap(err, "error when chowning file"))
			}

			// skip file even if error
			return nil
		}
		logrus.Error(err)
		return err
	})

	return nil
}
