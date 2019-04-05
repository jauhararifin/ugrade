package cmd

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade/ugctl/ugrade"
	"github.com/spf13/cobra"
)

// statusCmd represents the status command
var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Check your current status",
	Long:  `This will print current active user, contest and permitted languages of the contest`,
	RunE: func(cmd *cobra.Command, args []string) error {
		client := ugrade.NewClient()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return client.Status(ctx)
	},
}

func init() {
	rootCmd.AddCommand(statusCmd)
}
