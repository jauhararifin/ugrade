package fs

import (
	"github.com/jauhararifin/ugrade/sandbox"
)

type defaultFS struct {
}

// New create default implementation of `sandbox.FS`
func New() sandbox.FS {
	return &defaultFS{}
}
