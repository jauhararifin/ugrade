package client

import (
	"io/ioutil"

	"golang.org/x/xerrors"
)

func getToken() (string, error) {
	tokenPath, err := assertWorkingFile("session.tk")
	if err != nil {
		return "", xerrors.Errorf("cannot open session file: %w", err)
	}
	tokenBt, err := ioutil.ReadFile(tokenPath)
	if err != nil {
		return "", xerrors.Errorf("cannot read session file: %w", err)
	}
	token := string(tokenBt)
	if len(token) == 0 {
		return "", xerrors.New("you havent signed in yet")
	}
	return token, nil
}
