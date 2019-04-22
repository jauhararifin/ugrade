package ugrade

import "context"

// SubmitRequest represent input for submit command.
type SubmitRequest struct {
	LanguageID string
	ProblemID  string
	SourceCode string
}

// SubmitResult represent result of submit command.
type SubmitResult struct {
	ID string
}

// SubmissionListItem represent single submission when running `submission ls` command.
type SubmissionListItem struct {
	ID           string
	ProblemName  string
	LanguageName string
	IssuerName   string
	Verdict      string
	IssuedAt     string
}

// SubmissionListResult represent result of calling `submission ls` command.
type SubmissionListResult struct {
	Submissions []SubmissionListItem
}

// SignInRequest represent input for sign in command
type SignInRequest struct {
	ContestShortID string
	Email          string
	Password       string
}

// SignInResult represent result of sign in command
type SignInResult struct {
	UserID      string
	UserName    string
	ContestID   string
	ContestName string
}

// ProblemListItem represent single problem when running `problem ls` command.
type ProblemListItem struct {
	ID       string
	ShortID  string
	Name     string
	Disabled bool
}

// ProblemListResult represent result of calling `problem ls` command.
type ProblemListResult struct {
	Problems []ProblemListItem
}

// LanguageListItem represent single language when running `lang ls` command.
type LanguageListItem struct {
	ID         string
	Name       string
	Extensions []string
}

// LanguageListResult represent result of calling `lang ls` command.
type LanguageListResult struct {
	Languages []LanguageListItem
}

// Client represent ugrade client to interact with ugrade server.
type Client interface {
	Submit(ctx context.Context, request SubmitRequest) (*SubmitResult, error)
	Submissions(ctx context.Context) (*SubmissionListResult, error)
	SignOut(ctx context.Context) error
	SignIn(ctx context.Context, request SignInRequest) (*SignInResult, error)
	Problems(ctx context.Context) (*ProblemListResult, error)
	Languages(ctx context.Context) (*LanguageListResult, error)
}
