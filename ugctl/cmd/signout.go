package cmd

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade/ugctl/ugrade"
	"github.com/spf13/cobra"
)

// signoutCmd represents the signout command
var signoutCmd = &cobra.Command{
	Use:   "signout",
	Short: "Sign Out from your current contest",
	Long:  `This command basically just delete your session file`,
	RunE: func(cmd *cobra.Command, args []string) error {
		client := ugrade.NewClient()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return client.SignOut(ctx)
	},
}

func init() {
	rootCmd.AddCommand(signoutCmd)
}
