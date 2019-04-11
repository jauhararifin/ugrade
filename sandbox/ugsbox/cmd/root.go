package cmd

import "github.com/spf13/cobra"

var rootCmd = &cobra.Command{
	Use:          "ugsbox",
	SilenceUsage: false,
}

// Execute execute root command line.
func Execute() error {
	return rootCmd.Execute()
}
