package main

import (
	"context"
	"fmt"
	"os"

	"github.com/sirupsen/logrus"

	"github.com/jauhararifin/ugrade/grader"

	"github.com/jauhararifin/ugrade/grader/sandbox"

	"github.com/spf13/cobra"
)

func runSandbox(cmd *cobra.Command, args []string) {
	if len(args) < 1 {
		fmt.Fprintln(os.Stderr, "please provide sandbox working directory")
		os.Exit(-1)
	}

	if len(args) < 2 {
		fmt.Fprintln(os.Stderr, "please provide command you want to run")
		os.Exit(-1)
	}

	executor, err := sandbox.New()
	if err != nil {
		fmt.Fprintf(os.Stderr, "cannot create sandbox executor: %+v", err)
		os.Exit(-1)
	}

	ctx := context.Background()
	command := grader.Command{
		Path: args[1],
		Args: args[2:],
		Dir:  args[0],
	}
	if err := executor.ExecuteChild(ctx, command); err != nil {
		fmt.Fprintf(os.Stderr, "error executing command inside sandbox: %+v\n", err)
		os.Exit(-1)
	}

	os.Exit(0)
}

var sandboxCmd = &cobra.Command{
	Use:          "sandbox",
	SilenceUsage: true,
	Run:          runSandbox,
}

func init() {
	rootCmd.AddCommand(sandboxCmd)
	logrus.SetLevel(logrus.TraceLevel)
}
