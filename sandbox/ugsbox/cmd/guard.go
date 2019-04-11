package cmd

import (
	"context"
	"os"
	"os/exec"
	"syscall"
	"time"

	"github.com/jauhararifin/ugrade/sandbox/fs"
	"github.com/sirupsen/logrus"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/cgroup"

	"github.com/jauhararifin/ugrade/sandbox/rlimit"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

const randomUID = 61238

func executeGuard(cmd sandbox.Command) error {
	// extract image
	_, err := fs.PrepareFS(cmd.ImagePath, randomUID, randomUID)
	if err != nil {
		return errors.Wrap(err, "cannot prepare sandboxed directory")
	}

	// init cgroup
	cgrp, err := cgroup.New("ugrade-sandbox")
	if err != nil {
		return errors.Wrap(err, "cannot create/initialize cgroup")
	}

	// limit memory
	if err := cgrp.LimitMemory(cmd.MemoryLimit); err != nil {
		return errors.Wrap(err, "cannot set memory limit of cgroup")
	}

	// throttle memory
	if err := cgrp.ThrottleMemory(cmd.MemoryThrottle); err != nil {
		return errors.Wrap(err, "cannot set memory throttle")
	}

	// limit cpu time
	if err := cgrp.LimitCPU(cmd.TimeLimit); err != nil {
		return errors.Wrap(err, "cannot set cpu time limit")
	}

	// limit open file
	if cmd.OpenFile > 0 {
		if err := rlimit.LimitOpenFile(cmd.OpenFile); err != nil {
			return errors.Wrap(err, "cannot set open file limit")
		}
	}

	// limit fsize
	if cmd.FileSize > 0 {
		if err := rlimit.LimitFSize(cmd.FileSize); err != nil { // limit generated file sisze
			return errors.Wrap(err, "cannot set generate file limit")
		}
	}

	// create arguments for running jail
	jailArgs := append([]string{
		"jail",
		"--image", cmd.ImagePath,
		"--working-directory", cmd.Dir,
		"--",
		cmd.Path,
	}, cmd.Args...)

	// initialize jail process
	ctx := cgrp.Monitor(context.Background())
	osCmd := exec.CommandContext(ctx, "/proc/self/exe", jailArgs...)
	osCmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	osCmd.Stdin = os.Stdin
	osCmd.Stdout = os.Stdout
	osCmd.Stderr = os.Stderr

	// starting jail process to get its pid
	if err := osCmd.Start(); err != nil {
		return errors.Wrap(err, "cannot start jail process")
	}

	// put process to cgroup monitor
	if err := cgrp.Put(osCmd.Process); err != nil {
		return errors.Wrap(err, "cannot put process to cgroup monitor")
	}

	// wait program to exit
	if err := osCmd.Wait(); err != nil {
		if _, ok := errors.Cause(cgrp.Error()).(sandbox.MemoryLimitExceeded); ok {
			return errors.Cause(cgrp.Error())
		}
		if _, ok := errors.Cause(cgrp.Error()).(sandbox.TimeLimitExceeded); ok {
			return errors.Cause(cgrp.Error())
		}
		return errors.Wrap(err, "program exited with error")
	}

	return nil
}

func runGuard(cmd *cobra.Command, args []string) error {
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
	}

	if err := executeGuard(command); err != nil {
		if _, ok := errors.Cause(err).(sandbox.MemoryLimitExceeded); ok {
			logrus.Info("Memory Limit Exceeded")
			os.Exit(sandbox.ExitCodeMemoryLimitExceeded)
		} else if _, ok := errors.Cause(err).(sandbox.TimeLimitExceeded); ok {
			logrus.Info("Time Limit Exceeded")
			os.Exit(sandbox.ExitCodeTimeLimitExceeded)
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
	guardCmd.Flags().StringP("working-directory", "w", "/home", "working directory of process")
	guardCmd.Flags().StringP("image", "i", "", "compressed sandbox image (in .tar.xz) path")

	rootCmd.AddCommand(guardCmd)
}
