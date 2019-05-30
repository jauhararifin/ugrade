package secreter

import (
	"io/ioutil"
	"os"
	"os/exec"

	"golang.org/x/xerrors"
)

const password = "somepass"

// EncryptFile encrypt file
func EncryptFile(filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		return xerrors.Errorf("cannot open input file %s: %v", filename, err)
	}
	defer f.Close()
	g, err := ioutil.TempFile("", "")
	if err != nil {
		return xerrors.Errorf("cannot create temporary file %v:", err)
	}
	defer g.Close()
	c := exec.Command("openssl", "aes-256-cbc", "-k", password)
	c.Stdin = f
	c.Stdout = g
	if err := c.Run(); err != nil {
		return xerrors.Errorf("cannot encrypt input file using openssl: %v", err)
	}
	gn := g.Name()
	g.Close()
	f.Close()
	if err := os.Rename(gn, filename); err != nil {
		return xerrors.Errorf("cannot rename temp file to %s: %v", filename, err)
	}
	return nil
}

// DecryptFile encrypt file
func DecryptFile(filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		return xerrors.Errorf("cannot open input file %s: %v", filename, err)
	}
	defer f.Close()
	g, err := ioutil.TempFile("", "")
	if err != nil {
		return xerrors.Errorf("cannot create temporary file %v:", err)
	}
	defer g.Close()
	c := exec.Command("openssl", "aes-256-cbc", "-d", "-k", password)
	c.Stdin = f
	c.Stdout = g
	if err := c.Run(); err != nil {
		return xerrors.Errorf("cannot decrypt input file using openssl: %v", err)
	}
	gn := g.Name()
	g.Close()
	f.Close()
	if err := os.Rename(gn, filename); err != nil {
		return xerrors.Errorf("cannot rename temp file to %s: %v", filename, err)
	}
	return nil
}
