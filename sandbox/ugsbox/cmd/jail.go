package cmd

import (
	"github.com/jauhararifin/ugrade/sandbox/jail"
	"github.com/jauhararifin/ugrade/sandbox/uid"

	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

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

	thejail := jail.New()
	if err := thejail.Run(imagePath, workingDirectory, uid.AnonymousUID, uid.AnonymousUID, execPath, args[1:]); err != nil {
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
