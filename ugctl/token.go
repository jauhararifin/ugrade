package ugctl

import (
	"io/ioutil"

	"github.com/pkg/errors"
)

func getToken() (string, error) {
	tokenPath, err := assertWorkingFile("session.tk")
	if err != nil {
		return "", errors.Wrap(err, "cannot open session file")
	}
	tokenBt, err := ioutil.ReadFile(tokenPath)
	if err != nil {
		return "", errors.Wrap(err, "cannot read session file")
	}
	token := string(tokenBt)
	if len(token) == 0 {
		return "", errors.New("you havent signed in yet")
	}
	return token, nil
}
