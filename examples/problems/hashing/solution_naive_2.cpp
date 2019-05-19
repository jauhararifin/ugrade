#include <bits/stdc++.h>

using namespace std;

int t,n,q,x,a[50001],b[50001],pa[50000],pb[50000],na,nb;
unordered_map<int,int> c;

int main() {
	scanf("%d", &t);
	while (t--) {
		scanf("%d", &n);

		memset(a, 0, sizeof a);
		memset(b, 0, sizeof b);
		c.clear();
		na = nb = 0;
		int m = -1;
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
		for (int i = 0; i <= m; i++) {
			if (a[i] > 0)
				pa[na++] = i;
			if (b[i] > 0)
				pb[nb++] = i;
		}

		scanf("%d", &q);
		while (q--) {
			scanf("%d", &x);
			if (c.find(x) != c.end())
				printf("%d\n", c[x]);
			else if (x < 0 || x > 100000)
				printf("0\n");
			else {
				long long res = 0;
				if (na < nb) {
					for (int i = 0; i < na && pa[i] <= x; i++)
						if (x - pa[i] <= m) 
							res += (long long) a[pa[i]] * (long long) b[x - pa[i]];
				} else {
					for (int i = 0; i < nb && pb[i] <= x; i++)
						if (x - pb[i] <= m)
							res += (long long) b[pb[i]] * (long long) a[x - pb[i]];
				}
				printf("%lld\n", res);
				c[x] = res;
			}
		}
	}
	return 0;
}