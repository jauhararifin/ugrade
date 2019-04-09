package worker

import (
	"context"

	"github.com/pkg/errors"
)

func (worker *defaultWorker) generateContestantOutputs(
	ctx context.Context,
	inputs inputFiles,
	compiledContestant compilationResult,
	spec extractedSpec,
) (*executionSuite, error) {
	res, err := worker.executeSuite(ctx, inputs, compiledContestant, "contestant-", spec.timeLimit, spec.memoryLimit, spec.outputLimit, 3)
	if err != nil {
		return nil, errors.Wrap(err, "cannot run execute suite")
	}
	return res, err
}
