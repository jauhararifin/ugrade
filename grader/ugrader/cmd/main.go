package cmd

import (
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:           "ugrader",
	Short:         "Used to grade contestant submissions",
	Long:          `This program fetch job periodically from server, execute it and send the result back to server.`,
	SilenceUsage:  true,
	SilenceErrors: false,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		logrus.SetLevel(logrus.InfoLevel)
		if ok, _ := cmd.PersistentFlags().GetBool("debug"); ok {
			logrus.SetLevel(logrus.DebugLevel)
		}
		if ok, _ := cmd.PersistentFlags().GetBool("trace"); ok {
			logrus.SetLevel(logrus.TraceLevel)
		}
	},
}

func init() {
	rootCmd.PersistentFlags().Bool("debug", false, "show debug log")
	rootCmd.PersistentFlags().Bool("trace", false, "show trace log")
}

// Execute run ugrader as cli.
func Execute() error {
	return rootCmd.Execute()
}
