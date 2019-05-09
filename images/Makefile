all: install

gxx-compiler.tar.xz:
	./gxx-compiler.sh

static-runtime.tar.xz:
	./static-runtime.sh

/usr/share/ugrade/images:
	mkdir -p /usr/share/ugrade/images

install: /usr/share/ugrade/images gxx-compiler.tar.xz static-runtime.tar.xz
	sudo cp gxx-compiler.tar.xz /usr/share/ugrade/images/
	sudo cp static-runtime.tar.xz /usr/share/ugrade/images/

clean:
	rm -rf tempfs
	rm -f gxx-compiler.tar.xz
	rm -f static-runtime.tar.xz