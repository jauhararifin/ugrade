package cmd

import (
	"github.com/jauhararifin/ugrade/grader/sandbox"
)

func init() {
	sandbox.BindCommand(rootCmd)
}
