#include <bits/stdc++.h>

using namespace std;

int t,n,q,x,a[100000],b[100000];
long long p[200001];

int main() {
	scanf("%d", &t);
	while (t--) {
		scanf("%d", &n);
		for (int i = 0; i < n; i++) scanf("%d", a + i);
		for (int i = 0; i < n; i++) scanf("%d", b + i);
		memset(p, 0, sizeof p);
		for (int i = 0; i < n; i++)
			for (int j = 0; j < n; j++)
				p[a[i] + b[j]]++;
		scanf("%d", &q);
		while (q--) {
			scanf("%d", &x);
			if (x < 0 || x > 200000) printf("0\n");
			else printf("%lld\n", p[x]);
		}
	}
	return 0;
}