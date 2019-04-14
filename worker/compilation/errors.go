package compilation

type compileError struct{ error }

func (*compileError) CompilationError() bool {
	return true
}

func genCompileError(err error) error {
	return &compileError{
		error: err,
	}
}
