package blkio

const pollingDelay = 100 // how fast we poll the blkio usage, in milisecond

type limitSize struct {
	filename string
	limit    uint64
}

// Limiter represent blkio limiter.
type Limiter struct {
	// Name should be unique of all limiter.
	Name string
}
