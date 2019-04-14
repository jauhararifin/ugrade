package testcase

import (
	"crypto/md5"
	"fmt"
	"io"
	"os"

	"github.com/jauhararifin/ugrade/worker"
	"github.com/pkg/errors"
)

func (*defaultGenerator) hashSpecTestcase(spec worker.JobSpec) (string, error) {
	// TODO: just simple hash, fix this.
	hash := md5.New()

	tcgenF, err := os.Open(spec.TCGen.Path)
	if err != nil {
		return "", errors.Wrap(err, "cannot open testcase generator source code")
	}
	defer tcgenF.Close()
	if _, err := io.Copy(hash, tcgenF); err != nil {
		return "", errors.Wrap(err, "cannot copy testcase generator source code to hasher")
	}

	juryF, err := os.Open(spec.Solution.Path)
	if err != nil {
		return "", errors.Wrap(err, "cannot open jury solution source code")
	}
	defer juryF.Close()
	if _, err := io.Copy(hash, juryF); err != nil {
		return "", errors.Wrap(err, "cannot copy jury source code to hasher")
	}

	hashval := hash.Sum(nil)
	return fmt.Sprintf("%x", hashval), nil
}
