package sandbox

import (
	"io/ioutil"
	"path"
	"strings"

	"github.com/pkg/errors"
)

func (sb *defaultSandbox) PrepareDir() (string, string, error) {
	workDir := path.Join(sb.sandboxDir, "home")
	name, err := ioutil.TempDir(workDir, "") // absolute dir path from host
	if err != nil {
		return "", "", errors.Wrap(err, "cannot create temporary directory")
	}
	localDir := strings.TrimPrefix(name, sb.sandboxDir) // aboslute dir path from sandbox
	return name, localDir, nil
}
