package main

import "path"

func (sb *defaultSandbox) Path(sandboxPath string) Path {
	return Path{
		Host:    path.Join(sb.sandboxDir, sandboxPath),
		Sandbox: sandboxPath,
	}
}
