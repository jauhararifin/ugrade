package worker

import (
	"context"
	"io"

	"github.com/pkg/errors"
)

func compileC(ctx context.Context, sourceCode io.Reader) (io.Reader, error) {
	return nil, nil
}

func compileCpp11(ctx context.Context, sourceCode io.Reader) (io.Reader, error) {
	return nil, nil
}

func compile(ctx context.Context, languageID string, sourceCode io.Reader) (io.Reader, error) {
	if languageID == "1" { // C
		return compileC(ctx, sourceCode)
	} else if languageID == "2" { // C++11
		return compileCpp11(ctx, sourceCode)
	}
	return nil, errors.Errorf("cannot compile using language with id %s", languageID)
}
