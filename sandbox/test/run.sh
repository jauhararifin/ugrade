#!/bin/bash

mkdir -p wd

sudo cp ./examples/* wd

run() {
    echo ""
    echo $1

    ugsbox guard \
        --memory-limit 268435456 \
        --time-limit 10000 \
        --image /usr/share/ugrade/images/gxx-compiler.tar.xz \
        --bind wd:/wd \
        -- g++ /wd/$1 -o /wd/exec -static -std=c++11 -O3

    ugsbox guard \
        --memory-limit 268435456 \
        --memory-throttle 368435456 \
        --time-limit 3000 \
        --file-size 134217728 \
        --nproc 1 \
        --open-file 64 \
        --stdout /wd/stdout \
        --walltime-limit 5000 \
        --image /usr/share/ugrade/images/static-runtime.tar.xz \
        --bind wd:/wd \
        -- /wd/exec
}

run busy_alloc.cpp
run busy.cpp
run busy_sleeping.cpp
run busy_write.cpp
run compile_error.cpp
run exitone.cpp
run fork_bomb.cpp
run zerodiv.cpp