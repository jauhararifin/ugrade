#include <bits/stdc++.h>

using namespace std;

int main() {
    int batch_size = 128 * 1024 * 1024;
    char* s = (char*) malloc(batch_size);
    while (1) {
        for (int i = 0; i < batch_size; i++)
            s[i] = rand() % 26 + 'a';
        s[batch_size - 1] = 0;
        printf("%s", s);
    }
    free(s);
    return 0;
}