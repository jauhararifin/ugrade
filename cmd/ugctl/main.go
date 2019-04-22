package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:           "ugctl",
	Short:         "UGrade command line interface",
	Long:          `Command line interface for ugrade. Sometimes CLI is better than GUI. So here i am.`,
	SilenceUsage:  true,
	SilenceErrors: true,
}

func init() {
	rootCmd.PersistentFlags().StringP("server-url", "u", "http://localhost:8000", "Server url")
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
