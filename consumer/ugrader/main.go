package main

import (
	"os"

	"github.com/jauhararifin/ugrade/grader/ugrader/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
