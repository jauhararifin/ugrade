package cmd

import (
	"github.com/spf13/cobra"
)

var langCmd = &cobra.Command{
	Use:   "lang",
	Short: "List, update permitted languages in a contest",
}

func init() {
	rootCmd.AddCommand(langCmd)
}
