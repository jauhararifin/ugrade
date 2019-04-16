package tcgenerator

import (
	"crypto/md5"
	"fmt"
	"io"
	"os"

	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"
)

func (*defaultGenerator) hashSpecTestcase(spec ugrade.JobSpec) (string, error) {
	// TODO: just simple hash, fix this.
	hash := md5.New()

	tcgenF, err := os.Open(spec.TCGen.Path)
	if err != nil {
		return "", xerrors.Errorf("cannot open testcase generator source code: %w", err)
	}
	defer tcgenF.Close()
	if _, err := io.Copy(hash, tcgenF); err != nil {
		return "", xerrors.Errorf("cannot copy testcase generator source code to hasher: %w", err)
	}

	juryF, err := os.Open(spec.Solution.Path)
	if err != nil {
		return "", xerrors.Errorf("cannot open jury solution source code: %w", err)
	}
	defer juryF.Close()
	if _, err := io.Copy(hash, juryF); err != nil {
		return "", xerrors.Errorf("cannot copy jury source code to hasher: %w", err)
	}

	hashval := hash.Sum(nil)
	return fmt.Sprintf("%x", hashval), nil
}
