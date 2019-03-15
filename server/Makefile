packages = ./auth \
	./auth/simple \
	./auth/simple/inmemory \
	./cmd/server \
	./otc \
	./server \
	./uuid

all: install generate

install-dep:
	dep version || curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh

ensure-deps: install-dep
	dep ensure

install: ensure-deps

generate: 
	go generate $(packages)

test:
	go test -v -race -coverprofile=coverage.txt -covermode=atomic ./... $(packages)

clean:
	go clean