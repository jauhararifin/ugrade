all: build

build:
	go build -o bin/ugsbox ./ugsbox
	sudo chown root:root bin/ugsbox
	sudo chmod ug+s bin/ugsbox

install:
	go install ./ugsbox
	sudo chown root:root `which ugsbox`
	sudo chmod ug+s `which ugsbox`