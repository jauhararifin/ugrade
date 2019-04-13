archive: clean gxx-compiler/ static-runtime/
	cd gxx-compiler && tar -cf - * | xz -9 -c - > ../gxx-compiler.tar.xz
	cd static-runtime && tar -cf - * | xz -9 -c - > ../static-runtime.tar.xz

clean:
	rm -f gxx-compiler.tar.xz
	rm -f static-runtime.tar.xz

install: archive
	sudo mkdir -p /usr/share/ugrade/images
	sudo cp gxx-compiler.tar.xz /usr/share/ugrade/images/
	sudo cp static-runtime.tar.xz /usr/share/ugrade/images/
