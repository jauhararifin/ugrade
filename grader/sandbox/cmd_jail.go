package sandbox

import (
	"context"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func runJail(cmd *cobra.Command, args []string) {
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

	// create new sandbox executor
	sandbox, err := New()
	if err != nil {
		fmt.Fprintf(os.Stderr, "cannot create sandbox executor: %+v", err)
		os.Exit(255)
	}
	executor := sandbox.(*defaultSandbox)

	// prepare command to run
	command := Command{
		Path: execPath,
		Args: args,
		Dir:  executor.Path(workingDirectory),
	}

	ctx := context.Background()
	if err := executor.executeJail(ctx, command); err != nil {
		os.Exit(1)
	}
	os.Exit(0)
}

var jailCmd = &cobra.Command{
	Use:          "jail",
	SilenceUsage: true,
	Run:          runJail,
}

func init() {
	jailCmd.Flags().StringP("working-directory", "w", "/home", "working directory of process")
	jailCmd.Flags().StringP("path", "p", "", "executable path")
}
