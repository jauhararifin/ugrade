package cmd

import (
	"context"
	"os"
	"time"

	"github.com/jauhararifin/ugrade/ugctl/ugrade"
	"github.com/olekukonko/tablewriter"
	"github.com/spf13/cobra"
)

var submissionLsCmd = &cobra.Command{
	Use:   "ls",
	Short: "List submissions in current contest",
	RunE: func(cmd *cobra.Command, args []string) error {
		client := ugrade.NewClient()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		result, err := client.SubmissionList(ctx)
		if err != nil {
			return err
		}

		table := tablewriter.NewWriter(os.Stdout)
		table.SetHeader([]string{"ID", "Problem", "Language", "Issuer", "Verdict", "Issued At"})
		for _, sub := range result.Submissions {
			table.Append([]string{
				sub.ID,
				sub.ProblemName,
				sub.LanguageName,
				sub.IssuerName,
				sub.Verdict,
				sub.IssuedAt,
			})
		}
		table.Render()

		return nil
	},
}

func init() {
	submissionCmd.AddCommand(submissionLsCmd)
}
