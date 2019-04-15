#include <bits/stdc++.h>

using namespace std;

int main() {
    int a = 0;
    for (int i = 0; i < 100; i++)
        a += i;
    for (int i = 99; i >= 0; i--)
        a -= i;
    printf("%d\n", 100 / a);
    return 0;
}