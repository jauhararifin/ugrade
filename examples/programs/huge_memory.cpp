#include <bits/stdc++.h>

using namespace std;

int main() {
  while (1) {
    char* mem = (char*) malloc(1024 * 1024 * 32); // allocate 32 mb
    memset(mem, 0, 1024 * 1024 * 32);
    for (int i = 0; i < 1024 * 1024 * 32; i++) {
      mem[i] = i;
    }
    free(mem);
  }
  return 0;
}
