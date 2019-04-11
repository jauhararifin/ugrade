package cmd

import (
	"os"
	"os/exec"
	"syscall"

	"github.com/jauhararifin/ugrade/sandbox/fs"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

func executeJail(imagePath, workingDirectory, commandPath string, args []string) error {
	if err := fs.Chroot(imagePath, randomUID, randomUID); err != nil {
		return errors.Wrap(err, "cannot chroot")
	}

	if err := os.Chdir(workingDirectory); err != nil {
		return errors.Wrap(err, "cannot change dir to working directory")
	}

	proc := exec.Command(commandPath, args...)
	proc.Stdin = os.Stdin
	proc.Stdout = os.Stdout
	proc.Stderr = os.Stderr

	// clone namespaces for guard process
	proc.SysProcAttr = &syscall.SysProcAttr{
		Cloneflags: syscall.CLONE_NEWUTS |
			syscall.CLONE_NEWIPC |
			syscall.CLONE_NEWPID |
			syscall.CLONE_NEWNS |
			syscall.CLONE_NEWNET,
		Credential: &syscall.Credential{Uid: randomUID, Gid: randomUID},
	}

	if err := proc.Run(); err != nil {
		return errors.Wrap(err, "cannot run program")
	}

	return nil
}

func runJail(cmd *cobra.Command, args []string) error {
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

	if err := executeJail(imagePath, workingDirectory, execPath, args[1:]); err != nil {
		return errors.Wrap(err, "cannot execute jail")
	}

	return nil
}

var jailCmd = &cobra.Command{
	Use:          "jail",
	SilenceUsage: true,
	RunE:         runJail,
}

func init() {
	jailCmd.Flags().StringP("working-directory", "w", "/home", "working directory inside sandbox of process")
	jailCmd.Flags().StringP("image", "i", "", "compressed sandbox image (in .tar.xz) path")

	rootCmd.AddCommand(jailCmd)
}
