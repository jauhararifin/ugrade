package main

import (
	"os"

	"github.com/jauhararifin/ugrade/grader/ugrader/cmd"
	"github.com/sirupsen/logrus"
)

func main() {
	logrus.SetLevel(logrus.TraceLevel)
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
