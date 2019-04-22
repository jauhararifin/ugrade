package main

import (
	"context"
	"fmt"
	"time"

	"github.com/howeyc/gopass"
	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/client"
	"github.com/spf13/cobra"
)

func doSignIn(cmd *cobra.Command, args []string) error {
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

	gqlURL, err := rootCmd.PersistentFlags().GetString("server-url")
	if err != nil {
		return err
	}
	client := client.NewClient(gqlURL)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result, err := client.SignIn(ctx, ugrade.SignInRequest{
		ContestShortID: contestSID,
		Email:          email,
		Password:       password,
	})
	if err != nil {
		return err
	}

	fmt.Printf(
		"\xE2\x9C\x94 signed in as %s (id: %s) in %s (id: %s)\n",
		result.UserName,
		result.UserID,
		result.ContestName,
		result.ContestID,
	)
	return nil
}

var signInCmd = &cobra.Command{
	Use:   "signin",
	Short: "Sign in into your contest",
	Long:  `Sign in will send signin request to server and save session token in your local machine`,
	RunE:  doSignIn,
}

func init() {
	rootCmd.AddCommand(signInCmd)

	signInCmd.Flags().StringP("contest", "c", "", "contest short ID")
	signInCmd.Flags().StringP("email", "e", "", "your email")
	signInCmd.Flags().StringP("password", "p", "", "your password")

	signInCmd.MarkFlagRequired("contest")
	signInCmd.MarkFlagRequired("email")
}
