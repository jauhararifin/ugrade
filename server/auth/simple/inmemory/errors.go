package inmemory

type noSuchUser struct {
}

func (*noSuchUser) Error() string {
	return "no such user"
}

func (*noSuchUser) IsNoSuchUser() bool {
	return true
}

type noSuchContest struct {
}

func (*noSuchContest) Error() string {
	return "no such contest"
}

func (*noSuchContest) IsNoSuchContest() bool {
	return true
}
