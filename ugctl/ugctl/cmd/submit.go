package cmd

import (
	"context"
	"fmt"
	"time"

	"github.com/jauhararifin/ugrade/ugctl"
	"github.com/spf13/cobra"
)

func doSubmit(cmd *cobra.Command, args []string) error {
	language := cmd.Flag("language").Value.String()
	problem := cmd.Flag("problem").Value.String()
	solution := cmd.Flag("solution").Value.String()

	gqlURL, err := rootCmd.PersistentFlags().GetString("server-url")
	if err != nil {
		return err
	}
	client := ugctl.NewClient(gqlURL)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := client.Submit(ctx, ugctl.SubmitRequest{
		LanguageID: language,
		ProblemID:  problem,
		SourceCode: solution,
	})
	if err != nil {
		return err
	}

	fmt.Println("\xE2\x9C\x94 solution submitted with id:", result.ID)
	return nil
}

// submitCmd represents the submit command
var submitCmd = &cobra.Command{
	Use:   "submit",
	Short: "Submit solution",
	Long:  `Submit your source code to ugrade platform`,
	RunE:  doSubmit,
}

func init() {
	rootCmd.AddCommand(submitCmd)

	submitCmd.Flags().StringP("language", "l", "", "language id of your solution")
	submitCmd.Flags().StringP("problem", "p", "", "problem id you want to submit")
	submitCmd.Flags().StringP("solution", "s", "", "your solution file")

	submitCmd.MarkFlagRequired("language")
	submitCmd.MarkFlagRequired("problem")
	submitCmd.MarkFlagRequired("solution")
}
