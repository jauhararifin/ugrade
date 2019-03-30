#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

int main(int argc, char** argv) {
    if (argc < 3)
        return -1;

    char* output = argv[1];
    int output_fd = open(output, O_RDONLY);
    if (output_fd < 0) {
        perror("Cannot read output file\n");
        return -1;
    }

    char* expected = argv[2];
    int expected_fd = open(expected, O_RDONLY);
    if (expected_fd < 0) {
        perror("Cannot read expected output file\n");
    }

    const unsigned int buffer_size = 1024 * 4; // using 4KB buffer
    char* buffer1 = (char*) malloc(buffer_size);
    char* buffer2 = (char*) malloc(buffer_size);
    int read1, read2;
    do {
        read1 = read(output_fd, buffer1, buffer_size);
        if (read1 < 0) {
            perror("Cannot read from output file");
            return -1;
        }

        read2 = read(expected_fd, buffer2, buffer_size);
        if (read2 < 0) {
            perror("Cannot read from expected file");
            return -1;
        }

        if (read1 != read2) {
            printf("WA\n"); // wrong answer, file has different size
            return 0;
        }

        if (memcmp(buffer1, buffer2, read1) != 0) {
            printf("WA\n"); // wrong answer, file differ
            return 0;
        }
    } while (read1 > 0);

    printf("AC\n");
    return 0;
}