package main

import (
	"log"

	"github.com/jauhararifin/ugrade/sandbox/ugsbox/cmd"
)

func main() {
	if err := cmd.Execute(); err != nil {
		log.Fatal(err)
	}
}
