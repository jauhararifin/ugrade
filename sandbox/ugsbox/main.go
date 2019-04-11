package main

import (
	"log"

	"github.com/sirupsen/logrus"

	"github.com/jauhararifin/ugrade/sandbox/ugsbox/cmd"
)

func main() {
	logrus.SetLevel(logrus.TraceLevel)
	if err := cmd.Execute(); err != nil {
		log.Fatal(err)
	}
}
