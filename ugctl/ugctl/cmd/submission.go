package cmd

import (
	"github.com/spf13/cobra"
)

var submissionCmd = &cobra.Command{
	Use:   "submission",
	Short: "List, submit, inspect submissions in a contest",
}

func init() {
	rootCmd.AddCommand(submissionCmd)
}
