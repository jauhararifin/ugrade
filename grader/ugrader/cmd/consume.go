package cmd

import (
	"context"

	"github.com/jauhararifin/ugrade/grader/consumer"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

var serverURL = "http://localhost:8000"

func runConsume(cmd *cobra.Command, args []string) error {
	token := cmd.Flag("token").Value.String()
	if len(token) == 0 {
		return errors.New("missing token")
	}

	ctx := context.Background()
	cons := consumer.New(serverURL)
	if err := cons.Consume(ctx, token); err != nil {
		return errors.Wrap(err, "cannot consume job")
	}

	return nil
}

var consumeCmd = &cobra.Command{
	Use:           "consume",
	Short:         "Fetch and executing job from server",
	Long:          `This program fetch job from server, execute it and send the result back to server.`,
	SilenceUsage:  true,
	SilenceErrors: false,
	RunE:          runConsume,
}

func init() {
	rootCmd.AddCommand(consumeCmd)
	consumeCmd.Flags().StringP("token", "t", "", "Your session token")
	consumeCmd.MarkPersistentFlagRequired("token")
}
