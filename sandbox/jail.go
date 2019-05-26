package sandbox

import "github.com/jauhararifin/ugrade"

// Jail run process inside new chrooted directory and cloned namespace
type Jail interface {
	Run(
		imagePath,
		workingDirectory string,
		uid,
		gid uint32,
		binds []ugrade.FSBind,
		stdin,
		stdout,
		stderr,
		commandPath string,
		args []string,
	) error
}
