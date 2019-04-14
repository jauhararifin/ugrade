package worker

// CompilationError indicates that the error is because of compilation problem.
type CompilationError interface {
	error
	CompilationError() bool
}
