package cmd

import (
	"context"
	"fmt"
	"time"

	"github.com/howeyc/gopass"
	"github.com/jauhararifin/ugrade/ugctl/ugrade"
	"github.com/spf13/cobra"
)

// signInCmd represents the login command
var signInCmd = &cobra.Command{
	Use:   "signin",
	Short: "Sign in into your contest",
	Long:  `Sign in will send signin request to server and save session token in your local machine`,
	RunE: func(cmd *cobra.Command, args []string) error {
		contestSID := cmd.Flag("contest").Value.String()
		email := cmd.Flag("email").Value.String()
		if len(contestSID) == 0 || len(email) == 0 {
			fmt.Println("Please provide contest id and email")
			return nil
		}

		password := cmd.Flag("password").Value.String()
		if len(password) == 0 {
			fmt.Print("Enter Password: ")
			passB, err := gopass.GetPasswd()
			if err != nil {
				return err
			}
			password = string(passB)
		}

		client := ugrade.NewClient()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return client.SignIn(ctx, contestSID, email, password)
	},
}

func init() {
	rootCmd.AddCommand(signInCmd)

	signInCmd.Flags().StringP("contest", "c", "", "contest short ID")
	signInCmd.Flags().StringP("email", "e", "", "your email")
	signInCmd.Flags().StringP("password", "p", "", "your password")
}
