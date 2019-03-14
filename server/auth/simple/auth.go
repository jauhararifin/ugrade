package simple

// Simple is struct that implement auth.Service
type Simple struct {
	store Store
}

// New create new Simple auth.Service
func New(store Store) *Simple {
	return &Simple{store}
}
