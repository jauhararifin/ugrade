all: build install

build:
	go build -o bin/ugrader ./ugrader
	# sudo setcap cap_sys_chroot+epi bin/ugrader
	# sudo chown root:root bin/ugrader
	# sudo chmod +s bin/ugrader

install:
	go install ./ugrader