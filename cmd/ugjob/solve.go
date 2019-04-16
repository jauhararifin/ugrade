package main

import (
	"context"
	"time"

	"github.com/jauhararifin/ugrade"
	"github.com/jauhararifin/ugrade/jobsolver/solver"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"golang.org/x/xerrors"
)

func runSolve(cmd *cobra.Command, args []string) error {
	tcgenSource := cmd.Flag("tcgen-source").Value.String()
	if len(tcgenSource) == 0 {
		return xerrors.New("please provide a valid testcase generator source")
	}

	tcgenLang := cmd.Flag("tcgen-lang").Value.String()
	if len(tcgenLang) == 0 {
		return xerrors.New("please provide a valid testcase generator language")
	}

	jurySource := cmd.Flag("jury-source").Value.String()
	if len(jurySource) == 0 {
		return xerrors.New("please provide a valid jury solution source")
	}

	juryLang := cmd.Flag("jury-lang").Value.String()
	if len(juryLang) == 0 {
		return xerrors.New("please provide a valid jury solution language")
	}

	checkerSource := cmd.Flag("checker-source").Value.String()
	if len(checkerSource) == 0 {
		return xerrors.New("please provide a valid checker source")
	}

	checkerLang := cmd.Flag("checker-lang").Value.String()
	if len(checkerLang) == 0 {
		return xerrors.New("please provide a valid checker language")
	}

	submissionSource := cmd.Flag("submission-source").Value.String()
	if len(submissionSource) == 0 {
		return xerrors.New("please provide a valid submission source")
	}

	submissionLang := cmd.Flag("submission-lang").Value.String()
	if len(submissionLang) == 0 {
		return xerrors.New("please provide a valid submission language")
	}

	timeLimit, err := cmd.Flags().GetUint64("time-limit")
	if err != nil {
		return xerrors.Errorf("cannot parse time limit arguments: %w", err)
	}

	memoryLimit, err := cmd.Flags().GetUint64("memory-limit")
	if err != nil {
		return xerrors.Errorf("cannot parse memory limit arguments: %w", err)
	}

	outputLimit, err := cmd.Flags().GetUint64("output-limit")
	if err != nil {
		return xerrors.Errorf("cannot parse output limit arguments: %w", err)
	}

	spec := ugrade.JobSpec{
		TCGen: ugrade.SourceCode{
			Path:     tcgenSource,
			Language: tcgenLang,
		},
		Solution: ugrade.SourceCode{
			Path:     jurySource,
			Language: juryLang,
		},
		Checker: ugrade.SourceCode{
			Path:     checkerSource,
			Language: checkerLang,
		},
		Submission: ugrade.SourceCode{
			Path:     submissionSource,
			Language: submissionLang,
		},

		MemoryLimit: memoryLimit,
		TimeLimit:   time.Duration(timeLimit) * time.Millisecond,
		OutputLimit: outputLimit,
	}

	solv, err := solver.New()
	if err != nil {
		return xerrors.Errorf("cannot create solver: %w", err)
	}

	result, err := solv.Solve(context.Background(), spec)
	if err != nil {
		return xerrors.Errorf("cannot solve job specification: %w", err)
	}
	logrus.WithField("verdict", result.Verdict).Info("job solved")

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

	solveCmd.Flags().Uint64P("memory-limit", "m", 256*1024*1024, "maximum memory usage")
	solveCmd.Flags().Uint64P("output-limit", "o", 256*1024*1024, "maximum output generated")
	solveCmd.Flags().Uint64P("time-limit", "x", 10000, "maximum time used by cpu")

	rootCmd.AddCommand(solveCmd)
}
