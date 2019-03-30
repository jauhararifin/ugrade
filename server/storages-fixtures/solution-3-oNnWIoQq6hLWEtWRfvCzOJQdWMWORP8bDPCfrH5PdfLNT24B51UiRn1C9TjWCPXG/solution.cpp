#include <bits/stdc++.h>

using namespace std;

int t;
long long l,r;

long long pxor(long long x) {
	switch(x % 4) {
		case 1: return 1;
		case 2: return x + 1;
		case 3: return 0;
	}
	return x;
}

int main() {
	scanf("%d", &t);
	while (t--) {
		scanf("%lld%lld", &l, &r);
		printf("%lld\n", pxor(r) ^ pxor(l-1));
	}
	return 0;
}