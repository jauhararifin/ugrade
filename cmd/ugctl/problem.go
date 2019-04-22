package main

import (
	"github.com/spf13/cobra"
)

var problemCmd = &cobra.Command{
	Use:   "problem",
	Short: "List, create, read, update and delete problem in contest",
}

func init() {
	rootCmd.AddCommand(problemCmd)
}
