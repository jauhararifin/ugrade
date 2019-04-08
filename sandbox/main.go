package main

import (
	"os"

	"github.com/sirupsen/logrus"
)

func main() {
	logrus.SetLevel(logrus.TraceLevel)
	if err := sandboxCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
