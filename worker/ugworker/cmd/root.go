package cmd

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use: "ugworker",
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		logrus.SetLevel(logrus.TraceLevel)
	},
}

// Execute execute root command line.
func Execute() error {
	return rootCmd.Execute()
}
