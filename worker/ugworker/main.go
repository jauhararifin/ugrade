package main

import (
	"os"

	"github.com/jauhararifin/ugrade/worker/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
