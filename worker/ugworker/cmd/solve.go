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
		return errors.New("please provice a valid testcase generator source")
	}

	tcgenLang := cmd.Flag("tcgen-lang").Value.String()
	if len(tcgenLang) == 0 {
		return errors.New("please provice a valid testcase generator language")
	}

	spec := worker.JobSpec{
		TCGen: worker.SourceCode{
			Path:     tcgenSource,
			Language: tcgenLang,
		},
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

	rootCmd.AddCommand(solveCmd)
}
