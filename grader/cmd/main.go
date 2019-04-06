package main

import (
	"os"

	"github.com/sirupsen/logrus"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:           "ugrader",
	Short:         "Used to grade contestant submissions",
	Long:          `This program fetch job periodically from server, execute it and send the result back to server.`,
	SilenceUsage:  true,
	SilenceErrors: false,
}

func main() {
	logrus.SetLevel(logrus.TraceLevel)
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}
