package auth

// User represent user in the UGrade system.
type User struct {
	ID          string
	ContestID   string
	Username    string
	Email       string
	Name        string
	SignedUp    bool
	Permissions []int
}
