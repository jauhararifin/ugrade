package cmd

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jauhararifin/ugrade/grader/sandbox"
	"github.com/spf13/cobra"
)

func runSandbox(cmd *cobra.Command, args []string) {
	// get working directory inside sandbox path
	workingDirectory := cmd.Flag("working-directory").Value.String()
	if len(workingDirectory) == 0 {
		fmt.Fprintln(os.Stderr, "please provide sandbox working directory")
		os.Exit(255)
	}

	// get command to run
	execPath := cmd.Flag("path").Value.String()
	if len(execPath) == 0 {
		fmt.Fprintln(os.Stderr, "please provide command you want to run")
		os.Exit(255)
	}

	// get time limit
	timeLimit, err := cmd.Flags().GetUint32("timelimit")
	if err != nil {
		fmt.Fprintln(os.Stderr, "please provide a valid time limit")
		os.Exit(255)
	}

	// get memory limit
	memoryLimit, err := cmd.Flags().GetUint32("memorylimit")
	if err != nil {
		fmt.Fprintln(os.Stderr, "please provide a valid memory limit")
		os.Exit(255)
	}

	// create new sandbox executor
	executor, err := sandbox.New()
	if err != nil {
		fmt.Fprintf(os.Stderr, "cannot create sandbox executor: %+v", err)
		os.Exit(255)
	}

	// add 5 minutes time limit
	ctx := context.Background()
	ctx, cancel := context.WithTimeout(ctx, time.Duration(timeLimit)*time.Millisecond)
	defer cancel()

	command := sandbox.Command{
		Path:        execPath,
		Args:        args,
		Dir:         executor.Path(workingDirectory),
		TimeLimit:   timeLimit,
		MemoryLimit: memoryLimit,
	}
	if err := executor.ExecuteChild(ctx, command); err != nil {
		fmt.Fprintf(os.Stderr, "error executing command inside sandbox: %+v\n", err)
		os.Exit(1)
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
	sandboxCmd.Flags().Uint32P("timelimit", "t", 10000, "time limit in milisecond")
	sandboxCmd.Flags().Uint32P("memorylimit", "m", 64*1024*1024, "memory limit in bytes")
	sandboxCmd.Flags().StringP("working-directory", "w", "/home", "working directory of process")
	sandboxCmd.Flags().StringP("path", "p", "", "executable path")
}
