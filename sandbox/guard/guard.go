package guard

import (
	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/cgroup"
	"github.com/jauhararifin/ugrade/sandbox/fs"
	"github.com/jauhararifin/ugrade/sandbox/rlimit"
	"github.com/pkg/errors"
)

type defaultGuard struct {
	fs   sandbox.FS
	cgrp sandbox.CGroup
	rlim sandbox.RLimit
}

// New create default implementation of `sandbox.Guard`
func New() (sandbox.Guard, error) {
	cgrp, err := cgroup.New("ugsbox")
	if err != nil {
		return nil, errors.Errorf("cannot initialize cgroup: %v", err)
	}

	return &defaultGuard{
		fs:   fs.New(),
		rlim: rlimit.New(),
		cgrp: cgrp,
	}, nil
}
