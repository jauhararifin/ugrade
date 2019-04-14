package cmd

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var debug = false
var trace = false

var rootCmd = &cobra.Command{
	Use: "ugworker",
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if debug {
			logrus.SetLevel(logrus.DebugLevel)
		}
		if trace {
			logrus.SetLevel(logrus.TraceLevel)
		}
	},
}

func init() {
	rootCmd.PersistentFlags().BoolVar(&debug, "debug", false, "show debug message")
	rootCmd.PersistentFlags().BoolVar(&trace, "trace", false, "show trace message")
}

// Execute execute root command line.
func Execute() error {
	return rootCmd.Execute()
}
