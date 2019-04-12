package cmd

import (
	"context"
	"os"
	"time"

	"github.com/jauhararifin/ugrade/sandbox/guard"

	"github.com/sirupsen/logrus"

	"github.com/jauhararifin/ugrade/sandbox"

	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

func runGuard(cmd *cobra.Command, args []string) error {
	// create guard instance
	guard, err := guard.New()
	if err != nil {
		return errors.Wrap(err, "cannot initialize guard process")
	}

	// get image path
	imagePath := cmd.Flag("image").Value.String()
	if len(imagePath) == 0 {
		return errors.New("missing image path")
	}

	// get working directory inside sandbox path
	workingDirectory := cmd.Flag("working-directory").Value.String()
	if len(workingDirectory) == 0 {
		return errors.New("please provide sandbox working directory")
	}

	// get command to run
	if len(args) < 1 {
		return errors.New("missing path to be executed")
	}
	execPath := args[0]

	// get time limit
	timeLimit, err := cmd.Flags().GetUint64("time-limit")
	if err != nil {
		return errors.New("please provide a valid time limit")
	}

	// get memory limit
	memoryLimit, err := cmd.Flags().GetUint64("memory-limit")
	if err != nil {
		return errors.New("please provide a valid memory limit")
	}

	// get memory limit
	memoryThrottle, err := cmd.Flags().GetUint64("memory-throttle")
	if err != nil {
		return errors.New("please provide a valid memory throttle")
	}

	// get file size limit
	fileSize, err := cmd.Flags().GetUint64("file-size")
	if err != nil {
		return errors.New("please provide a valid file size limit")
	}

	// get open file limit
	openFile, err := cmd.Flags().GetUint64("open-file")
	if err != nil {
		return errors.New("please provide a valid open file limit")
	}

	// get open file limit
	nproc, err := cmd.Flags().GetUint64("nproc")
	if err != nil {
		return errors.New("please provide a valid number of process")
	}

	// get open file limit
	stackSize, err := cmd.Flags().GetUint64("stack-size")
	if err != nil {
		return errors.New("please provide a valid stack size")
	}

	command := sandbox.Command{
		ImagePath:      imagePath,
		Path:           execPath,
		Args:           args[1:],
		Dir:            workingDirectory,
		TimeLimit:      time.Duration(timeLimit) * time.Millisecond,
		MemoryLimit:    memoryLimit,
		MemoryThrottle: memoryThrottle,
		FileSize:       fileSize,
		OpenFile:       openFile,
		NProc:          nproc,
		StackSize:      stackSize,
	}

	if err := guard.Run(context.Background(), command); err != nil {
		if _, ok := errors.Cause(err).(sandbox.MemoryLimitExceeded); ok {
			logrus.Info("Memory Limit Exceeded")
			os.Exit(sandbox.ExitCodeMemoryLimitExceeded)
		} else if _, ok := errors.Cause(err).(sandbox.TimeLimitExceeded); ok {
			logrus.Info("Time Limit Exceeded")
			os.Exit(sandbox.ExitCodeTimeLimitExceeded)
		} else if _, ok := errors.Cause(err).(sandbox.RuntimeError); ok {
			logrus.Info("Runtime Error")
			os.Exit(sandbox.ExitCodeRuntimeError)
		} else if _, ok := errors.Cause(err).(sandbox.InternalError); ok {
			logrus.Info("Internal Error")
			os.Exit(sandbox.ExitCodeInternalError)
		}

		logrus.Error(err)
		os.Exit(1)
	}

	os.Exit(0)
	return nil
}

var guardCmd = &cobra.Command{
	Use:          "guard",
	SilenceUsage: true,
	RunE:         runGuard,
}

func init() {
	guardCmd.Flags().Uint64P("time-limit", "t", 10000, "time limit in milisecond")
	guardCmd.Flags().Uint64P("memory-limit", "m", 64*1024*1024, "memory limit in bytes")
	guardCmd.Flags().Uint64P("memory-throttle", "M", 256*1024*1024, "memory throttle in bytes")
	guardCmd.Flags().Uint64P("file-size", "f", 0, "generated file size limit")
	guardCmd.Flags().Uint64P("open-file", "o", 0, "open file limit")
	guardCmd.Flags().Uint64P("nproc", "n", 0, "limit process creation e.g.: fork/exec")
	guardCmd.Flags().Uint64P("stack-size", "s", 0, "limit stack size in bytes")
	guardCmd.Flags().StringP("working-directory", "w", "/home", "working directory of process")
	guardCmd.Flags().StringP("image", "i", "", "compressed sandbox image (in .tar.xz) path")

	rootCmd.AddCommand(guardCmd)
}
