package cmd

import (
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:           "ugrader",
	Short:         "Used to grade contestant submissions",
	Long:          `This program fetch job periodically from server, execute it and send the result back to server.`,
	SilenceUsage:  true,
	SilenceErrors: false,
}

// Execute run ugrader as cli.
func Execute() error {
	return rootCmd.Execute()
}
