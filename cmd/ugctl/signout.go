package main

import (
	"context"
	"fmt"
	"time"

	"github.com/jauhararifin/ugrade/client"
	"github.com/spf13/cobra"
)

func doSignOut(cmd *cobra.Command, args []string) error {
	gqlURL, err := rootCmd.PersistentFlags().GetString("server-url")
	if err != nil {
		return err
	}
	client := client.NewClient(gqlURL)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := client.SignOut(ctx); err != nil {
		return err
	}
	fmt.Println("\xE2\x9C\x94 signed out")
	return nil
}

var signoutCmd = &cobra.Command{
	Use:   "signout",
	Short: "Sign Out from your current contest",
	Long:  `This command basically just delete your session file`,
	RunE:  doSignOut,
}

func init() {
	rootCmd.AddCommand(signoutCmd)
}
