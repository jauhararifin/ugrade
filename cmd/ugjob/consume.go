package main

import (
	"context"

	"github.com/jauhararifin/ugrade/consumer"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

func runConsume(cmd *cobra.Command, args []string) error {
	token := cmd.Flag("token").Value.String()
	if len(token) == 0 {
		return errors.New("missing token")
	}

	serverURL := cmd.Flag("server-url").Value.String()
	if len(serverURL) == 0 {
		serverURL = "http://localhost:8000"
	}

	ctx := context.Background()
	cons := consumer.New(serverURL)
	if err := cons.Consume(ctx, token); err != nil {
		return errors.Wrap(err, "cannot consume job")
	}

	return nil
}

var consumeCmd = &cobra.Command{
	Use:          "consume",
	Short:        "Fetch and executing job from server",
	Long:         `This program fetch job from server, execute it and send the result back to server.`,
	SilenceUsage: true,
	RunE:         runConsume,
}

func init() {
	rootCmd.AddCommand(consumeCmd)
	consumeCmd.Flags().StringP("token", "t", "", "Your session token")
	consumeCmd.Flags().StringP("server-url", "u", "http://localhost:8000", "Server url")
	consumeCmd.MarkPersistentFlagRequired("token")
}
