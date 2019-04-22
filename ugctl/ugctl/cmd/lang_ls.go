package cmd

import (
	"context"
	"os"
	"time"

	"github.com/jauhararifin/ugrade/ugctl"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
)

var langLsCmd = &cobra.Command{
	Use:   "ls",
	Short: "List permitted languages in current contest",
	RunE: func(cmd *cobra.Command, args []string) error {
		gqlURL, err := rootCmd.PersistentFlags().GetString("server-url")
		if err != nil {
			return err
		}
		client := ugctl.NewClient(gqlURL)
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		result, err := client.LanguageList(ctx)
		if err != nil {
			return err
		}

		table := tablewriter.NewWriter(os.Stdout)
		table.SetHeader([]string{"ID", "Name", "Extensions"})
		for _, lang := range result.Languages {
			for _, ext := range lang.Extensions {
				table.Append([]string{
					lang.ID,
					lang.Name,
					ext,
				})
			}
		}
		table.SetAutoMergeCells(true)
		table.Render()

		return nil
	},
}

func init() {
	langCmd.AddCommand(langLsCmd)
}
