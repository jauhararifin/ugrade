package cmd

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use: "ugworker",
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if ok, _ := cmd.PersistentFlags().GetBool("debug"); ok {
			logrus.SetLevel(logrus.DebugLevel)
		}
		if ok, _ := cmd.PersistentFlags().GetBool("trace"); ok {
			logrus.SetLevel(logrus.TraceLevel)
		}
	},
}

func init() {
	rootCmd.PersistentFlags().Bool("debug", false, "show debug message")
	rootCmd.PersistentFlags().Bool("trace", false, "show trace message")
}

// Execute execute root command line.
func Execute() error {
	return rootCmd.Execute()
}
