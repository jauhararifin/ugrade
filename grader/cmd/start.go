package main

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade/grader"
	"github.com/jauhararifin/ugrade/grader/client"
	"github.com/jauhararifin/ugrade/grader/worker"
	"github.com/pkg/errors"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
)

var serverURL = "http://localhost:8000"

func pollJob(ctx context.Context, client grader.Client, worker grader.Worker, token string) error {
	// fetch job from server
	logrus.Debugf("asking for job to server")
	ctxGet, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()
	job, err := client.GetJob(ctxGet, token)
	if err != nil {
		return errors.Wrap(err, "cannot fetch job")
	}
	defer job.Spec.Close()
	logrus.WithField("job", job).Info("found a job")

	// execute job
	logrus.WithField("job", job).Debug("executing job")
	executeCtx, cancelExecute := context.WithTimeout(ctx, 5*time.Minute)
	defer cancelExecute()
	result, err := worker.Execute(executeCtx, *job)
	if err != nil {
		return errors.Wrap(err, "cannot execute job")
	}
	defer result.Output.Close()
	logrus.WithField("result", result).Info("job execute finished")

	// submit job
	logrus.WithField("result", result).Debug("submitting job result")
	submitCtx, cancelSubmit := context.WithTimeout(ctx, 10*time.Second)
	defer cancelSubmit()
	err = client.SubmitJob(submitCtx, token, *result)
	if err != nil {
		return errors.Wrap(err, "cannot submit job result")
	}
	logrus.WithField("result", result).Info("job result submitted")

	return nil
}

func runStart(cmd *cobra.Command, args []string) error {
	token := cmd.Flag("token").Value.String()
	if len(token) == 0 {
		return errors.New("missing token")
	}

	client := client.New(serverURL)
	worker, err := worker.New()
	if err != nil {
		return err
	}
	ctx := context.Background()

	logrus.WithField("serverURL", serverURL).Info("start listening to job")
	for {
		err := pollJob(ctx, client, worker, token)
		if errors.Cause(err) == grader.ErrNoSuchJob {
			time.Sleep(5 * time.Second)
		} else if err != nil {
			logrus.WithError(err).Error("error when fetching, executing or submitting job")
			time.Sleep(10 * time.Second)
		}
	}
}

var startCmd = &cobra.Command{
	Use:           "start",
	Short:         "Start fetching and executing job from server periodically",
	Long:          `This program fetch job periodically from server, execute it and send the result back to server.`,
	SilenceUsage:  true,
	SilenceErrors: false,
	RunE:          runStart,
}

func init() {
	rootCmd.AddCommand(startCmd)
	startCmd.Flags().StringP("token", "t", "", "Your session token")
	startCmd.MarkPersistentFlagRequired("token")
}
