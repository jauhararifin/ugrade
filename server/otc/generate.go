package otc

import "math/rand"

// Random generates random 8 number
func Random() string {
	var letterRunes = []rune("0123456789")
	b := make([]rune, 8)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}
