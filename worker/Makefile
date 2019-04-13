all: build

build:
	go build -o bin/ugworker ./ugworker
	sudo chown root:root bin/ugworker
	sudo chmod ug+s bin/ugworker

install:
	go install ./ugworker
	sudo chown root:root `which ugworker`
	sudo chmod ug+s `which ugworker`