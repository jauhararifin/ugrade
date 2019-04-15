#include <bits/stdc++.h>

using namespace std;

int main() {
    int sz = 4 * 1024 * 1024;
    while (1) {
        int* v = (int*) malloc(sz * sizeof(int));
        for (int i = 0; i < sz; i++)
            v[i] = rand() + i;
        if (rand() % 2942 == 0) return 0;
    }
    return 0;
}