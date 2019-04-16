all: build-ugsbox install-ugsbox build-ugjob install-ugjob

build-ugsbox:
	go build -o bin/ugsbox github.com/jauhararifin/ugrade/cmd/ugsbox
	sudo chown root:root bin/ugsbox
	sudo chmod ug+s bin/ugsbox

install-ugsbox:
	go install github.com/jauhararifin/ugrade/cmd/ugsbox
	sudo chown root:root `which ugsbox`
	sudo chmod ug+s `which ugsbox`

build-ugjob:
	go build -o bin/ugjob github.com/jauhararifin/ugrade/cmd/ugjob
	sudo chown root:root bin/ugjob
	sudo chmod ug+s bin/ugjob

install-ugjob:
	go install github.com/jauhararifin/ugrade/cmd/ugjob
	sudo chown root:root `which ugjob`
	sudo chmod ug+s `which ugjob`