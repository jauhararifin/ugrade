package cmd

import (
	"context"
	"fmt"
	"time"

	"github.com/jauhararifin/ugrade/ugctl/ugrade"
	"github.com/spf13/cobra"
)

// submitCmd represents the submit command
var submitCmd = &cobra.Command{
	Use:   "submit",
	Short: "Submit solution",
	Long:  `Submit your source code to ugrade platform`,
	RunE: func(cmd *cobra.Command, args []string) error {
		language := cmd.Flag("language").Value.String()
		problem := cmd.Flag("problem").Value.String()
		solution := cmd.Flag("solution").Value.String()

		if len(language) == 0 {
			fmt.Println("Please provide language id")
		}

		if len(problem) == 0 {
			fmt.Println("Please provide problem id")
		}

		if len(solution) == 0 {
			fmt.Println("Please provide solution id")
		}

		client := ugrade.NewClient()
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return client.Submit(ctx, language, problem, solution)
	},
}

func init() {
	rootCmd.AddCommand(submitCmd)

	submitCmd.Flags().StringP("language", "l", "", "language id of your solution")
	submitCmd.Flags().StringP("problem", "p", "", "problem id you want to submit")
	submitCmd.Flags().StringP("solution", "s", "", "your solution file")
}
