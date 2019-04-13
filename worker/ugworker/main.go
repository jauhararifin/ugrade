package main

import (
	"os"

	"github.com/jauhararifin/ugrade/worker/ugworker/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
