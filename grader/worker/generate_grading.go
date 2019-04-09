package worker

import (
	"bytes"
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jauhararifin/ugrade/grader"

	"github.com/pkg/errors"
)

type gradingItem struct {
	contestantDur time.Duration
	juryDur       time.Duration
	testcaseName  string
	verdict       string
}

type grading struct {
	items   []gradingItem
	verdict string
}

func calculateVerdict(items []gradingItem) string {
	ac := true
	for _, item := range items {
		if item.verdict != grader.AC {
			ac = false
			break
		}
	}
	if ac {
		return grader.AC
	}
	return grader.WA
}

func (worker *defaultWorker) generateGrading(
	ctx context.Context,
	checker compilationResult,
	contestant executionSuite,
	jury executionSuite,
) (*grading, error) {
	if len(contestant.executions) != len(jury.executions) {
		return nil, errors.New("contestant and jury execute different number of testcases")
	}

	nexec := len(contestant.executions)
	items := make([]gradingItem, nexec, nexec)
	for i := 0; i < nexec; i++ {
		if contestant.executions[i].input != jury.executions[i].input {
			return nil, errors.New("contestant and jury execute different testcase file")
		}
		items[i].contestantDur = contestant.executions[i].duration
		items[i].juryDur = jury.executions[i].duration
		items[i].testcaseName = strings.TrimSuffix(contestant.executions[i].input, ".in")

		contestantOutput := contestant.executions[i].output
		juryOutput := jury.executions[i].output

		var verdictBuff bytes.Buffer
		if _, err := worker.run(ctx, checker, []string{contestantOutput, juryOutput}, nil, &verdictBuff, 10000, 128*1024*1024); err != nil {
			return nil, errors.Wrap(err, "cannot execute checker")
		}

		var verdict string
		fmt.Fscanf(&verdictBuff, "%s", &verdict)

		if verdict == grader.AC || verdict == grader.WA {
			items[i].verdict = verdict
		} else {
			return nil, errors.Errorf("unknown verdict %s", verdict)
		}
	}

	return &grading{
		items:   items,
		verdict: calculateVerdict(items),
	}, nil
}
