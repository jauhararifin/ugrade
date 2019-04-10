package sandbox

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

func runGuard(cmd *cobra.Command, args []string) {
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
	timeLimit, err := cmd.Flags().GetUint64("time-limit")
	if err != nil {
		fmt.Fprintln(os.Stderr, "please provide a valid time limit")
		os.Exit(255)
	}

	// get memory limit
	memoryLimit, err := cmd.Flags().GetUint64("memory-limit")
	if err != nil {
		fmt.Fprintln(os.Stderr, "please provide a valid memory limit")
		os.Exit(255)
	}

	// get memory limit
	memoryThrottle, err := cmd.Flags().GetUint64("memory-throttle")
	if err != nil {
		fmt.Fprintln(os.Stderr, "please provide a valid memory throttle")
		os.Exit(255)
	}

	// get file size limit
	fileSize, err := cmd.Flags().GetUint64("file-size")
	if err != nil {
		fmt.Fprintln(os.Stderr, "please provide a valid file size limit")
		os.Exit(255)
	}

	// get open file limit
	openFile, err := cmd.Flags().GetUint64("open-file")
	if err != nil {
		fmt.Fprintln(os.Stderr, "please provide a valid open file limit")
		os.Exit(255)
	}

	// create new sandbox executor
	sandbox, err := New()
	if err != nil {
		fmt.Fprintf(os.Stderr, "cannot create sandbox executor: %+v", err)
		os.Exit(255)
	}
	executor := sandbox.(*defaultSandbox)

	command := Command{
		Path:           execPath,
		Args:           args,
		Dir:            executor.Path(workingDirectory),
		TimeLimit:      time.Duration(timeLimit) * time.Millisecond,
		MemoryLimit:    memoryLimit,
		MemoryThrottle: memoryThrottle,
		FileSize:       fileSize,
		OpenFile:       openFile,
	}

	ctx := context.Background()
	if err := executor.executeGuard(ctx, command); err != nil {
		fmt.Fprintf(os.Stderr, err.Error())

		if errors.Cause(err) == ErrMemoryLimitExceeded {
			os.Exit(ExitCodeMemoryLimitExceeded)
		} else if errors.Cause(err) == ErrTimeLimitExceeded {
			os.Exit(ExitCodeTimeLimitExceeded)
		}

		os.Exit(1)
	}

	os.Exit(0)
}

var guardCmd = &cobra.Command{
	Use:          "guard",
	SilenceUsage: true,
	Run:          runGuard,
}

func init() {
	guardCmd.Flags().Uint64P("time-limit", "t", 10000, "time limit in milisecond")
	guardCmd.Flags().Uint64P("memory-limit", "m", 64*1024*1024, "memory limit in bytes")
	guardCmd.Flags().Uint64P("memory-throttle", "M", 256*1024*1024, "memory throttle in bytes")
	guardCmd.Flags().Uint64P("file-size", "f", 0, "generated file size limit")
	guardCmd.Flags().Uint64P("open-file", "o", 0, "open file limit")
	guardCmd.Flags().StringP("working-directory", "w", "/home", "working directory of process")
	guardCmd.Flags().StringP("path", "p", "", "executable path")
}
