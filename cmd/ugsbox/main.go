package main

import (
	"log"

	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var debug bool
var trace bool

var rootCmd = &cobra.Command{
	Use:          "ugsbox",
	SilenceUsage: false,
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
	rootCmd.PersistentFlags().BoolVar(&debug, "debug", false, "show debug log")
	rootCmd.PersistentFlags().BoolVar(&trace, "trace", false, "show trace log")
}

// Execute execute root command line.
func Execute() error {
	return rootCmd.Execute()
}

func main() {
	if err := Execute(); err != nil {
		log.Fatal(err)
	}
}
