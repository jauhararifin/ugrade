package simple

import (
	"errors"
	"fmt"
	"regexp"

	"github.com/jauhararifin/ugrade/server/auth"
)

func validateUsername(username string) error {
	if len(username) < 4 {
		return errors.New("Username should contains 4 characters or more")
	}
	if len(username) < 64 {
		return errors.New("Username should not more than 64 characters")
	}
	if _, err := regexp.Match("[a-zA-Z0-9._-]+", []byte(username)); err != nil {
		return errors.New("Username should contain alphanumeric, dot, dash and underscore only")
	}
	return nil
}

func validateEmail(email string) error {
	regex := "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
	if _, err := regexp.Match(regex, []byte(email)); err != nil {
		return errors.New("Invalid email format")
	}
	return nil
}

func validateName(name string) error {
	if len(name) < 4 {
		return errors.New("Name should contains 4 characters or more")
	}
	if len(name) > 100 {
		return errors.New("Name should not contain more than 100 characters")
	}
	return nil
}

func validatePassword(password string) error {
	if len(password) < 8 {
		return errors.New("Password should contains 8 characters or more")
	}
	if len(password) > 100 {
		return errors.New("Password should not contain more than 100 characters")
	}
	return nil
}

func validatePermissions(permissions []int) error {
	authPerms := make(map[int]bool)
	for p := range auth.Permissions {
		authPerms[p] = true
	}
	for p := range permissions {
		if _, ok := authPerms[p]; !ok {
			return fmt.Errorf("No such permission with id %d", p)
		}
	}
	return nil
}
