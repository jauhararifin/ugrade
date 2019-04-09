package worker

import (
	"context"

	"github.com/pkg/errors"
)

func (worker *defaultWorker) generateTCOutputs(
	ctx context.Context,
	inputs inputFiles,
	compiledJury compilationResult,
	spec extractedSpec,
) (*executionSuite, error) {
	res, err := worker.executeSuite(ctx, inputs, compiledJury, "jury-", 10000, 128*1024*1024, spec.outputLimit, 3)
	if err != nil {
		return nil, errors.Wrap(err, "cannot run execute suite")
	}
	return res, err
}
