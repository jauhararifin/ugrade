#!/bin/bash

rm -rf tempfs
mkdir tempfs

docker export $(docker create frolvlad/alpine-gxx) | tar -C tempfs -xf -

rm -rf "tempfs/.dockerenv"
rm -rf "tempfs/proc"
rm -rf "tempfs/lib/apk"
rm -rf "tempfs/lib/mdev"
rm -rf "tempfs/lib/firmware"
rm -rf "tempfs/usr/lib/engines-1.1"
rm -rf "tempfs/usr/share"
rm -rf "tempfs/usr/bin/sum"
rm -rf "tempfs/usr/bin/split"
rm -rf "tempfs/usr/bin/ipcs"
rm -rf "tempfs/usr/bin/shred"
rm -rf "tempfs/usr/bin/gcov-tool"
rm -rf "tempfs/usr/bin/microcom"
rm -rf "tempfs/usr/bin/nslookup"
rm -rf "tempfs/usr/bin/hd"
rm -rf "tempfs/usr/bin/dumpleases"
rm -rf "tempfs/usr/bin/wc"
rm -rf "tempfs/usr/bin/unix2dos"
rm -rf "tempfs/usr/bin/sha256sum"
rm -rf "tempfs/usr/bin/factor"
rm -rf "tempfs/usr/bin/[["
rm -rf "tempfs/usr/bin/test"
rm -rf "tempfs/usr/bin/pscan"
rm -rf "tempfs/usr/bin/patch"
rm -rf "tempfs/usr/bin/expr"
rm -rf "tempfs/usr/bin/uptime"
rm -rf "tempfs/usr/bin/cc"
rm -rf "tempfs/usr/bin/["
rm -rf "tempfs/usr/bin/size"
rm -rf "tempfs/usr/bin/logger"
rm -rf "tempfs/usr/bin/tee"
rm -rf "tempfs/usr/bin/gcc-ranlib"
rm -rf "tempfs/usr/bin/shuf"
rm -rf "tempfs/usr/bin/cmp"
rm -rf "tempfs/usr/bin/getent"
rm -rf "tempfs/usr/bin/x86_64-alpine-linux-musl-gcc-8.3.0"
rm -rf "tempfs/usr/bin/whoami"
rm -rf "tempfs/usr/bin/blkdiscard"
rm -rf "tempfs/usr/bin/cut"
rm -rf "tempfs/usr/bin/c89"
rm -rf "tempfs/usr/bin/whois"
rm -rf "tempfs/usr/bin/lzma"
rm -rf "tempfs/usr/bin/scanelf"
rm -rf "tempfs/usr/bin/hostid"
rm -rf "tempfs/usr/bin/du"
rm -rf "tempfs/usr/bin/nl"
rm -rf "tempfs/usr/bin/printf"
rm -rf "tempfs/usr/bin/gcc-nm"
rm -rf "tempfs/usr/bin/unxz"
rm -rf "tempfs/usr/bin/uniq"
rm -rf "tempfs/usr/bin/killall"
rm -rf "tempfs/usr/bin/mkfifo"
rm -rf "tempfs/usr/bin/strip"
rm -rf "tempfs/usr/bin/nc"
rm -rf "tempfs/usr/bin/timeout"
rm -rf "tempfs/usr/bin/truncate"
rm -rf "tempfs/usr/bin/fold"
rm -rf "tempfs/usr/bin/dc"
rm -rf "tempfs/usr/bin/paste"
rm -rf "tempfs/usr/bin/readelf"
rm -rf "tempfs/usr/bin/cksum"
rm -rf "tempfs/usr/bin/diff"
rm -rf "tempfs/usr/bin/ipcrm"
rm -rf "tempfs/usr/bin/top"
rm -rf "tempfs/usr/bin/dos2unix"
rm -rf "tempfs/usr/bin/pgrep"
rm -rf "tempfs/usr/bin/unzip"
rm -rf "tempfs/usr/bin/ttysize"
rm -rf "tempfs/usr/bin/xxd"
rm -rf "tempfs/usr/bin/c99"
rm -rf "tempfs/usr/bin/reset"
rm -rf "tempfs/usr/bin/nm"
rm -rf "tempfs/usr/bin/objcopy"
rm -rf "tempfs/usr/bin/cal"
rm -rf "tempfs/usr/bin/gcov"
rm -rf "tempfs/usr/bin/gcov-dump"
rm -rf "tempfs/usr/bin/c++filt"
rm -rf "tempfs/usr/bin/pwdx"
rm -rf "tempfs/usr/bin/x86_64-alpine-linux-musl-gcc-nm"
rm -rf "tempfs/usr/bin/fallocate"
rm -rf "tempfs/usr/bin/awk"
rm -rf "tempfs/usr/bin/c++"
rm -rf "tempfs/usr/bin/smemcap"
rm -rf "tempfs/usr/bin/install"
rm -rf "tempfs/usr/bin/xzcat"
rm -rf "tempfs/usr/bin/nohup"
rm -rf "tempfs/usr/bin/mesg"
rm -rf "tempfs/usr/bin/x86_64-alpine-linux-musl-c++"
rm -rf "tempfs/usr/bin/find"
rm -rf "tempfs/usr/bin/ar"
rm -rf "tempfs/usr/bin/flock"
rm -rf "tempfs/usr/bin/xargs"
rm -rf "tempfs/usr/bin/eject"
rm -rf "tempfs/usr/bin/ranlib"
rm -rf "tempfs/usr/bin/vi"
rm -rf "tempfs/usr/bin/pmap"
rm -rf "tempfs/usr/bin/nsenter"
rm -rf "tempfs/usr/bin/elfedit"
rm -rf "tempfs/usr/bin/vlock"
rm -rf "tempfs/usr/bin/tac"
rm -rf "tempfs/usr/bin/ssl_client"
rm -rf "tempfs/usr/bin/getconf"
rm -rf "tempfs/usr/bin/unshare"
rm -rf "tempfs/usr/bin/traceroute6"
rm -rf "tempfs/usr/bin/unlink"
rm -rf "tempfs/usr/bin/groups"
rm -rf "tempfs/usr/bin/wget"
rm -rf "tempfs/usr/bin/dwp"
rm -rf "tempfs/usr/bin/pstree"
rm -rf "tempfs/usr/bin/which"
rm -rf "tempfs/usr/bin/bzip2"
rm -rf "tempfs/usr/bin/renice"
rm -rf "tempfs/usr/bin/lzopcat"
rm -rf "tempfs/usr/bin/x86_64-alpine-linux-musl-gcc-ar"
rm -rf "tempfs/usr/bin/passwd"
rm -rf "tempfs/usr/bin/head"
rm -rf "tempfs/usr/bin/strings"
rm -rf "tempfs/usr/bin/traceroute"
rm -rf "tempfs/usr/bin/gcc-ar"
rm -rf "tempfs/usr/bin/deallocvt"
rm -rf "tempfs/usr/bin/showkey"
rm -rf "tempfs/usr/bin/expand"
rm -rf "tempfs/usr/bin/unlzma"
rm -rf "tempfs/usr/bin/cryptpw"
rm -rf "tempfs/usr/bin/od"
rm -rf "tempfs/usr/bin/cpio"
rm -rf "tempfs/usr/bin/sha1sum"
rm -rf "tempfs/usr/bin/tr"
rm -rf "tempfs/usr/bin/hexdump"
rm -rf "tempfs/usr/bin/time"
rm -rf "tempfs/usr/bin/id"
rm -rf "tempfs/usr/bin/tty"
rm -rf "tempfs/usr/bin/dirname"
rm -rf "tempfs/usr/bin/sha3sum"
rm -rf "tempfs/usr/bin/addr2line"
rm -rf "tempfs/usr/bin/volname"
rm -rf "tempfs/usr/bin/nmeter"
rm -rf "tempfs/usr/bin/realpath"
rm -rf "tempfs/usr/bin/resize"
rm -rf "tempfs/usr/bin/setkeycodes"
rm -rf "tempfs/usr/bin/yes"
rm -rf "tempfs/usr/bin/chvt"
rm -rf "tempfs/usr/bin/env"
rm -rf "tempfs/usr/bin/cpp"
rm -rf "tempfs/usr/bin/seq"
rm -rf "tempfs/usr/bin/pkill"
rm -rf "tempfs/usr/bin/as"
rm -rf "tempfs/usr/bin/bzcat"
rm -rf "tempfs/usr/bin/less"
rm -rf "tempfs/usr/bin/lsof"
rm -rf "tempfs/usr/bin/ld.bfd"
rm -rf "tempfs/usr/bin/tail"
rm -rf "tempfs/usr/bin/setsid"
rm -rf "tempfs/usr/bin/bunzip2"
rm -rf "tempfs/usr/bin/md5sum"
rm -rf "tempfs/usr/bin/nproc"
rm -rf "tempfs/usr/bin/readlink"
rm -rf "tempfs/usr/bin/basename"
rm -rf "tempfs/usr/bin/openvt"
rm -rf "tempfs/usr/bin/gprof"
rm -rf "tempfs/usr/bin/sort"
rm -rf "tempfs/usr/bin/x86_64-alpine-linux-musl-gcc-ranlib"
rm -rf "tempfs/usr/bin/lzcat"
rm -rf "tempfs/usr/bin/lsusb"
rm -rf "tempfs/usr/bin/beep"
rm -rf "tempfs/usr/bin/uudecode"
rm -rf "tempfs/usr/bin/uuencode"
rm -rf "tempfs/usr/bin/crontab"
rm -rf "tempfs/usr/bin/clear"
rm -rf "tempfs/usr/bin/ldd"
rm -rf "tempfs/usr/bin/udhcpc6"
rm -rf "tempfs/usr/bin/objdump"
rm -rf "tempfs/usr/bin/iconv"
rm -rf "tempfs/usr/bin/ld"
rm -rf "tempfs/usr/bin/unlzop"
rm -rf "tempfs/usr/bin/unexpand"
rm -rf "tempfs/usr/bin/fuser"
rm -rf "tempfs/usr/bin/free"
rm -rf "tempfs/usr/bin/sha512sum"
rm -rf "tempfs/usr/bin/comm"
rm -rf "tempfs/usr/bin/mkpasswd"
rm -rf "tempfs/usr/local"
rm -rf "tempfs/usr/local/lib"
rm -rf "tempfs/usr/local/share"
rm -rf "tempfs/usr/local/bin"
rm -rf "tempfs/usr/sbin"
rm -rf "tempfs/dev"
rm -rf "tempfs/srv"
rm -rf "tempfs/root"
rm -rf "tempfs/opt"
rm -rf "tempfs/media"
rm -rf "tempfs/run"
rm -rf "tempfs/sys"
rm -rf "tempfs/tmp"
rm -rf "tempfs/bin/ps"
rm -rf "tempfs/bin/stty"
rm -rf "tempfs/bin/chmod"
rm -rf "tempfs/bin/uname"
rm -rf "tempfs/bin/true"
rm -rf "tempfs/bin/netstat"
rm -rf "tempfs/bin/kill"
rm -rf "tempfs/bin/sync"
rm -rf "tempfs/bin/arch"
rm -rf "tempfs/bin/mpstat"
rm -rf "tempfs/bin/kbd_mode"
rm -rf "tempfs/bin/ash"
rm -rf "tempfs/bin/mknod"
rm -rf "tempfs/bin/login"
rm -rf "tempfs/bin/chown"
rm -rf "tempfs/bin/hostname"
rm -rf "tempfs/bin/pidof"
rm -rf "tempfs/bin/umount"
rm -rf "tempfs/bin/printenv"
rm -rf "tempfs/bin/false"
rm -rf "tempfs/bin/mkdir"
rm -rf "tempfs/bin/base64"
rm -rf "tempfs/bin/ping6"
rm -rf "tempfs/bin/lzop"
rm -rf "tempfs/bin/mountpoint"
rm -rf "tempfs/bin/watch"
rm -rf "tempfs/bin/df"
rm -rf "tempfs/bin/linux32"
rm -rf "tempfs/bin/rmdir"
rm -rf "tempfs/bin/touch"
rm -rf "tempfs/bin/dmesg"
rm -rf "tempfs/bin/ionice"
rm -rf "tempfs/bin/ls"
rm -rf "tempfs/bin/sed"
rm -rf "tempfs/bin/mv"
rm -rf "tempfs/bin/fdflush"
rm -rf "tempfs/bin/dd"
rm -rf "tempfs/bin/ed"
rm -rf "tempfs/bin/fatattr"
rm -rf "tempfs/bin/nice"
rm -rf "tempfs/bin/echo"
rm -rf "tempfs/bin/grep"
rm -rf "tempfs/bin/conspy"
rm -rf "tempfs/bin/zcat"
rm -rf "tempfs/bin/pipe_progress"
rm -rf "tempfs/bin/run-parts"
rm -rf "tempfs/bin/cat"
rm -rf "tempfs/bin/mktemp"
rm -rf "tempfs/bin/getopt"
rm -rf "tempfs/bin/setpriv"
rm -rf "tempfs/bin/ipcalc"
rm -rf "tempfs/bin/more"
rm -rf "tempfs/bin/ln"
rm -rf "tempfs/bin/rev"
rm -rf "tempfs/bin/bbconfig"
rm -rf "tempfs/bin/dnsdomainname"
rm -rf "tempfs/bin/cp"
rm -rf "tempfs/bin/chgrp"
rm -rf "tempfs/bin/sleep"
rm -rf "tempfs/bin/pwd"
rm -rf "tempfs/bin/fgrep"
rm -rf "tempfs/bin/stat"
rm -rf "tempfs/bin/linux64"
rm -rf "tempfs/bin/makemime"
rm -rf "tempfs/bin/dumpkmap"
rm -rf "tempfs/bin/usleep"
rm -rf "tempfs/bin/tar"
rm -rf "tempfs/bin/setserial"
rm -rf "tempfs/bin/su"
rm -rf "tempfs/bin/reformime"
rm -rf "tempfs/bin/date"
rm -rf "tempfs/bin/fsync"
rm -rf "tempfs/bin/link"
rm -rf "tempfs/bin/egrep"
rm -rf "tempfs/bin/mount"
rm -rf "tempfs/bin/gzip"
rm -rf "tempfs/bin/iostat"
rm -rf "tempfs/bin/gunzip"
rm -rf "tempfs/bin/ping"
rm -rf "tempfs/mnt"
rm -rf "tempfs/sbin"
rm -rf "tempfs/var"
rm -rf "tempfs/etc"

cd tempfs && tar -cf - * | xz -9 -c - > ../gxx-compiler.tar.xz

