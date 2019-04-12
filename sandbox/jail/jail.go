package jail

import (
	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/fs"
)

type defaultJail struct {
	fs sandbox.FS
}

// New create default implementation of `sandbox.Jail`
func New() sandbox.Jail {
	return &defaultJail{
		fs: fs.New(),
	}
}
