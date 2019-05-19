#include <bits/stdc++.h>

using namespace std;

int t,n,q,x;
long long a[262144],b[262144],p[262144];

int nearest_two(int n) {
	if (__builtin_popcount(n) != 1) {
		int tmp;
		for (int i = 0; n > 0; i++, n>>=1)
			if (n & 1)
				tmp = 1<<(i+1);
		n = tmp;
	}
	return n;
}

void print(char* s, long long *a, int n) {
	printf("%s: ", s);
	for (int i = 0; i < n; i++) printf("%lld ", a[i]);
	printf("\n");
}

void karatsuba(int n, long long *a, long long *b, long long *c) {
	n = nearest_two(n);

	for (int i = 0; i < 2*n-1; i++)
		c[i] = 0;
	if (n < 3) {
		for (int i = 0; i < n; i++)
			for (int j = 0; j < n; j++)
				c[i+j] += a[i]*b[j];
		return;
	}

	long long *a0 = a;
	long long *a1 = a + n/2;
	long long *b0 = b;
	long long *b1 = b + n/2;

	long long *z0 = (long long*) malloc(n * sizeof(long long)); memset(z0, 0, n * sizeof(long long));
	karatsuba(n/2, a0, b0, z0);
	long long *z2 = (long long*) malloc(n * sizeof(long long)); memset(z2, 0, n * sizeof(long long));
	karatsuba(n/2, a1, b1, z2);
	long long *z1 = (long long*) malloc(n * sizeof(long long)); memset(z1, 0, n * sizeof(long long));

	long long *a2 = (long long*) malloc((n/2) * sizeof(long long));
	long long *b2 = (long long*) malloc((n/2) * sizeof(long long));
	for (int i = 0; i < n/2; i++)
		a2[i] = a0[i] + a1[i], b2[i] = b0[i] + b1[i];

	karatsuba(n/2, a2, b2, z1);
	for (int i = 0; i < n; i++)
		z1[i] -= z2[i] + z0[i];

	for (int i = 0; i < n; i++)
		c[i] += z0[i];
	for (int i = 0; i < n; i++)
		c[i+n/2] += z1[i];
	for (int i = 0; i < n; i++)
		c[i+n] += z2[i];

	free(z0);
	free(z1);
	free(z2);
	free(a2);
	free(b2);
}

int main() {
	scanf("%d", &t);
	while (t--) {
		scanf("%d", &n);
		int m = 0;
		memset(a, 0, sizeof a);
		memset(b, 0, sizeof b);
		for (int i = 0; i < n; i++) {
			scanf("%d", &x);
			a[x]++;
			m = max(m, x);
		}
		for (int i = 0; i < n; i++) {
			scanf("%d", &x);
			b[x]++;
			m = max(m, x);
		}
		memset(p, 0, sizeof p);
		karatsuba(m + 1, a, b, p);
		
		scanf("%d", &q);
		while (q--) {
			scanf("%d", &x);
			if (x < 0 || x > 200000) printf("0\n");
			else printf("%lld\n", p[x]);
		}
	}
	return 0;
}