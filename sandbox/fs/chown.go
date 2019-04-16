package fs

import (
	"os"
	"path"
	"path/filepath"
	"strings"

	"github.com/sirupsen/logrus"
)

func (*defaultFS) chownDir(dir string, uid, gid int) error {
	filepath.Walk(dir, func(name string, info os.FileInfo, err error) error {
		if err != nil {
			logrus.WithField("error", err).Error("found error when chowning dir")
			return err
		}

		if (info.Mode() & os.ModeSymlink) != 0 {
			newname, err := os.Readlink(name)
			if err != nil {
				logrus.WithField("name", name).Warn("error read link when chowning dir")
			}

			if strings.HasPrefix(newname, "/") {
				name = path.Join(dir, newname)
			} else {
				name = path.Join(filepath.Dir(name), newname)
			}
		}

		if err := os.Chown(name, uid, gid); err != nil {
			logrus.WithField("error", err).Warn("error when chowning file")
		}

		// skip file even if error
		return nil
	})

	return nil
}
