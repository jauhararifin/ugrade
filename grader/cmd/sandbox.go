package main

import (
	"fmt"
	"os"

	"github.com/jauhararifin/ugrade/grader/worker"

	"github.com/spf13/cobra"
)

func runSandbox(cmd *cobra.Command, args []string) {
	if len(args) == 0 {
		fmt.Fprintln(os.Stderr, "cannot determine root filesystem directory, please provide root filesystem dir in first argument")
		os.Exit(-1)
	}

	rootFSDir := args[0]
	args = args[1:]
	if err := worker.ExecuteChild(rootFSDir); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(-1)
	}
}

var sandboxCmd = &cobra.Command{
	Use:           "sandbox",
	SilenceUsage:  true,
	SilenceErrors: true,
	Run:           runSandbox,
}

func init() {
	rootCmd.AddCommand(startCmd)
}
