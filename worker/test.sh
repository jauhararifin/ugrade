#!/bin/bash

bin/ugworker solve \
	--tcgen-lang 2 \
	--tcgen-source ~/Documents/test/tcgen.cpp \
	--jury-lang 2 \
	--jury-source ~/Documents/test/solution.cpp \
	--checker-lang 1 \
	--checker-source ~/Documents/test/checker.c \
	--submission-lang 2 \
	--submission-source ~/Documents/test/submission.cpp
