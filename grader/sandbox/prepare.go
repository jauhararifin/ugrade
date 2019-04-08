package sandbox

import (
	"io/ioutil"
	"path"
	"strings"

	"github.com/pkg/errors"
)

func (sb *defaultSandbox) PrepareDir() (*Path, error) {
	workDir := path.Join(sb.sandboxDir, "home")
	name, err := ioutil.TempDir(workDir, "") // absolute dir path from host
	if err != nil {
		return nil, errors.Wrap(err, "cannot create temporary directory")
	}
	localDir := strings.TrimPrefix(name, sb.sandboxDir) // aboslute dir path from sandbox
	return &Path{
		Host:    name,
		Sandbox: localDir,
	}, nil
}
