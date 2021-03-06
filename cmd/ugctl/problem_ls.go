package main

import (
	"context"
	"os"
	"strconv"
	"time"

	"github.com/jauhararifin/ugrade/client"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
)

var problemLsCmd = &cobra.Command{
	Use:   "ls",
	Short: "List problems in current contest",
	RunE: func(cmd *cobra.Command, args []string) error {
		gqlURL, err := rootCmd.PersistentFlags().GetString("server-url")
		if err != nil {
			return err
		}
		client := client.NewClient(gqlURL)
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		result, err := client.Problems(ctx)
		if err != nil {
			return err
		}

		table := tablewriter.NewWriter(os.Stdout)
		table.SetHeader([]string{"ID", "Short ID", "Name", "Disabled"})
		for _, prob := range result.Problems {
			table.Append([]string{prob.ID, prob.ShortID, prob.Name, strconv.FormatBool(prob.Disabled)})
		}
		table.Render()

		return nil
	},
}

func init() {
	problemCmd.AddCommand(problemLsCmd)
}
