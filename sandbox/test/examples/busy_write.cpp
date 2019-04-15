#include <bits/stdc++.h>

using namespace std;

int main() {
    while (1) {
        int batch_size = 32 * 1024 * 1024;
        char* s = (char*) malloc(batch_size);
        for (int i = 0; i < batch_size; i++)
            s[i] = rand() % 26 + 'a';
        s[batch_size - 1] = 0;
        printf("%s", s);
        free(s);
    }
    return 1;
}