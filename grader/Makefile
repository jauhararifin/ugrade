all: build install

build:
	go build -o bin/ugrader ./ugrader
	sudo chown root:root bin/ugrader
	sudo chmod ug+s bin/ugrader

install:
	go install ./ugrader
	sudo chown root:root `which ugrader`
	sudo chmod ug+s `which ugrader`
