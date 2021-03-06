package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/jauhararifin/ugrade"
	"golang.org/x/xerrors"

	"github.com/jauhararifin/ugrade/sandbox"
	"github.com/jauhararifin/ugrade/sandbox/jail"
	"github.com/jauhararifin/ugrade/sandbox/uid"
	"github.com/spf13/cobra"
)

func runJail(cmd *cobra.Command, args []string) {
	// get image path
	imagePath := cmd.Flag("image").Value.String()
	if len(imagePath) == 0 {
		fmt.Fprintln(os.Stderr, "missing image path")
		os.Exit(sandbox.ExitCodeInternalError)
	}

	// get working directory inside sandbox path
	workingDirectory := cmd.Flag("working-directory").Value.String()
	if len(workingDirectory) == 0 {
		fmt.Fprintln(os.Stderr, "please provide sandbox working directory")
		os.Exit(sandbox.ExitCodeInternalError)
	}

	// get command to run
	if len(args) < 1 {
		fmt.Fprintln(os.Stderr, "missing path to be executed")
		os.Exit(sandbox.ExitCodeInternalError)
	}
	execPath := args[0]

	// get stdin, stdout, stderr parameter
	stdin := cmd.Flag("stdin").Value.String()
	stderr := cmd.Flag("stderr").Value.String()
	stdout := cmd.Flag("stdout").Value.String()

	// get binds
	bindsstr, err := cmd.Flags().GetStringSlice("bind")
	if err != nil {
		os.Exit(sandbox.ExitCodeInternalError)
	}
	binds := make([]ugrade.FSBind, 0, 0)
	for _, bnd := range bindsstr {
		// TODO: make better parser, still not working for many cases
		parts := strings.Split(bnd, ":")
		if len(parts) != 2 || len(parts[0]) == 0 || len(parts[1]) == 0 {
			os.Exit(sandbox.ExitCodeInternalError)
		}
		binds = append(binds, ugrade.FSBind{
			Host:    parts[0],
			Sandbox: parts[1],
		})
	}

	thejail := jail.New()
	if err := thejail.Run(
		imagePath,
		workingDirectory,
		uid.AnonymousUID,
		uid.AnonymousUID,
		binds,
		stdin,
		stdout,
		stderr,
		execPath,
		args[1:],
	); err != nil {
		if xerrors.Is(err, ugrade.ErrRuntimeError) {
			os.Exit(sandbox.ExitCodeRuntimeError)
			return
		}
		err = xerrors.Errorf("cannot execute jail: %w", err)
		fmt.Fprintln(os.Stderr, err)
		os.Exit(sandbox.ExitCodeInternalError)
	}
}

var jailCmd = &cobra.Command{
	Use:          "jail",
	SilenceUsage: true,
	Run:          runJail,
}

func init() {
	jailCmd.Flags().StringP("working-directory", "w", "/home", "working directory inside sandbox of process")
	jailCmd.Flags().StringP("stdin", "x", "", "path (relative to sandbox) to file to be used as stdin")
	jailCmd.Flags().StringP("stderr", "e", "", "path (relative to sandbox) to file to be used as stderr")
	jailCmd.Flags().StringP("stdout", "o", "", "path (relative to sandbox) to file to be used as stdout")
	jailCmd.Flags().StringP("image", "i", "", "compressed sandbox image (in .tar.xz) path")
	jailCmd.Flags().StringSliceP("bind", "b", []string{}, "bind host directory to sandbox directory with format <hostdir>:<sandboxdir>. Warning: file owner of binded directory will be changed")

	rootCmd.AddCommand(jailCmd)
}
