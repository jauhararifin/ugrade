package cmd

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var debug bool
var trace bool

var rootCmd = &cobra.Command{
	Use:           "ugrader",
	Short:         "Used to consume contestant submissions job",
	Long:          `This program fetch job from server, execute it and send the result back to server.`,
	SilenceUsage:  true,
	SilenceErrors: false,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		logrus.SetLevel(logrus.InfoLevel)
		if debug {
			logrus.SetLevel(logrus.DebugLevel)
		}
		if trace {
			logrus.SetLevel(logrus.TraceLevel)
		}
	},
}

func init() {
	rootCmd.PersistentFlags().BoolVar(&debug, "debug", false, "show debug log")
	rootCmd.PersistentFlags().BoolVar(&trace, "trace", false, "show trace log")
}

// Execute run ugrader as cli.
func Execute() error {
	return rootCmd.Execute()
}
