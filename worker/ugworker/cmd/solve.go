package cmd

import (
	"context"
	"fmt"

	"github.com/jauhararifin/ugrade/worker"
	"github.com/jauhararifin/ugrade/worker/solver"
	"github.com/pkg/errors"
	"github.com/spf13/cobra"
)

func runSolve(cmd *cobra.Command, args []string) error {
	tcgenSource := cmd.Flag("tcgen-source").Value.String()
	if len(tcgenSource) == 0 {
		return errors.New("please provide a valid testcase generator source")
	}

	tcgenLang := cmd.Flag("tcgen-lang").Value.String()
	if len(tcgenLang) == 0 {
		return errors.New("please provide a valid testcase generator language")
	}

	jurySource := cmd.Flag("jury-source").Value.String()
	if len(jurySource) == 0 {
		return errors.New("please provide a valid jury solution source")
	}

	juryLang := cmd.Flag("jury-lang").Value.String()
	if len(juryLang) == 0 {
		return errors.New("please provide a valid jury solution language")
	}

	checkerSource := cmd.Flag("checker-source").Value.String()
	if len(checkerSource) == 0 {
		return errors.New("please provide a valid checker source")
	}

	checkerLang := cmd.Flag("checker-lang").Value.String()
	if len(checkerLang) == 0 {
		return errors.New("please provide a valid checker language")
	}

	submissionSource := cmd.Flag("submission-source").Value.String()
	if len(submissionSource) == 0 {
		return errors.New("please provide a valid submission source")
	}

	submissionLang := cmd.Flag("submission-lang").Value.String()
	if len(submissionLang) == 0 {
		return errors.New("please provide a valid submission language")
	}

	spec := worker.JobSpec{
		TCGen: worker.SourceCode{
			Path:     tcgenSource,
			Language: tcgenLang,
		},
		Solution: worker.SourceCode{
			Path:     jurySource,
			Language: juryLang,
		},
		Checker: worker.SourceCode{
			Path:     checkerSource,
			Language: checkerLang,
		},
		Submission: worker.SourceCode{
			Path:     submissionSource,
			Language: submissionLang,
		},

		OutputLimit: 256 * 1024 * 1024,
	}

	solv, err := solver.New()
	if err != nil {
		return errors.Wrap(err, "cannot create solver")
	}

	result, err := solv.Solve(context.Background(), spec)
	if err != nil {
		return errors.Wrap(err, "cannot solve job specification")
	}

	fmt.Println(result)

	return nil
}

var solveCmd = &cobra.Command{
	Use:          "solve",
	SilenceUsage: true,
	RunE:         runSolve,
}

func init() {
	solveCmd.Flags().StringP("tcgen-source", "T", "", "testcase generator source code")
	solveCmd.Flags().StringP("tcgen-lang", "t", "", "testcase generator language")
	solveCmd.Flags().StringP("jury-source", "J", "", "jury solution source code")
	solveCmd.Flags().StringP("jury-lang", "j", "", "jury solution language")
	solveCmd.Flags().StringP("checker-source", "C", "", "checker source code")
	solveCmd.Flags().StringP("checker-lang", "c", "", "checker language")
	solveCmd.Flags().StringP("submission-source", "S", "", "submission source code")
	solveCmd.Flags().StringP("submission-lang", "s", "", "submission language")

	rootCmd.AddCommand(solveCmd)
}
