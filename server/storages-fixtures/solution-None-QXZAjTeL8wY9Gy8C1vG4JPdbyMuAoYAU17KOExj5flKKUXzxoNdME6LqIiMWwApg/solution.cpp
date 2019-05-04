#include <bits/stdc++.h>

using namespace std;

#define pol vector<complex<double> >
#define ll long long

const double PI = acos(-1);

void dft(pol &a, pol &result) {
	if (a.size() == 1) {
		result = a;
		return;
	}
	pol _a0, _a1;
	for (int i = 0; i < a.size(); i++)
		if (i % 2)
			_a1.push_back(a[i]);
		else
			_a0.push_back(a[i]);
	dft(_a0, _a0);
	dft(_a1, _a1);

	result.resize(a.size());
	complex<double> wn = complex<double>(cos(2.0*PI/a.size()),sin(2.0*PI/a.size()));
	complex<double> w = 1;
	for (int k = 0; k < a.size()/2; k++) {
		result[k] = _a0[k] + w*_a1[k];
		result[k+a.size()/2] = _a0[k] - w*_a1[k];
		w *= wn;
	}
}

void inverse_dft_rec(pol &a, pol &result) {
	if (a.size() == 1) {
		result = a;
		return;
	}
	pol _a0, _a1;
	for (int i = 0; i < a.size(); i++)
		if (i % 2)
			_a1.push_back(a[i]);
		else
			_a0.push_back(a[i]);
	inverse_dft_rec(_a0, _a0);
	inverse_dft_rec(_a1, _a1);

	result.resize(a.size());
	complex<double> wn = complex<double>(cos(2.0*PI/a.size()),sin(2.0*PI/a.size()));
	complex<double> w = 1;
	for (int k = 0; k < a.size()/2; k++) {
		result[k] = _a0[k] + _a1[k]/w;
		result[k+a.size()/2] = _a0[k] - _a1[k]/w;
		w *= wn;
	}
}
void inverse_dft(pol &a, pol &result) {
	inverse_dft_rec(a, result);
	for (int i = 0; i < (int) result.size(); i++)
		result[i] /= result.size();
}

void fft(pol &a, pol &b, pol &result) {
	int n = (int) a.size();
	for (int i = 0; i < n; i++)
		a.push_back(0), b.push_back(0);
	pol a0,b0,c;
	dft(a, a0);
	dft(b, b0);
	result.resize(2*n);
	for (int i = 0; i < 2*n; i++)
		result[i] = a0[i]*b0[i];
	inverse_dft(result, result);
}

vector<ll> polymul(vector<ll> &a, vector<ll> &b) {
	pol ta,tb,tr;
	for (ll x : a) ta.push_back(x);
	for (ll x : b) tb.push_back(x);
	while (__builtin_popcount(ta.size()) > 1) ta.push_back(0);
	while (__builtin_popcount(tb.size()) > 1) tb.push_back(0);
	fft(ta,tb,tr);

	vector<ll> result;
	for (int i = 0; i < tr.size(); i++)
		result.push_back((ll) round(tr[i].real()));
	return result;
}

void cout_arr(string s, vector<ll> a) {
	for (ll x : a)
		cout<<x<<" ";
	cout<<endl;
}

int t,n,q;
vector<ll> a,b;

int main() {
	scanf("%d", &t);
	while (t--) {
		scanf("%d", &n);
		a.clear(); b.clear();
		for (int i = 0; i < n; i++) {
			int x; scanf("%d", &x);
			while (a.size() <= x)
				a.push_back(0);
			a[x]++;
		}
		for (int i = 0; i < n; i++) {
			int x; scanf("%d", &x);
			while (b.size() <= x)
				b.push_back(0);
			b[x]++;
		}
		while (a.size() < b.size()) a.push_back(0);
		while (b.size() < a.size()) b.push_back(0);

		vector<ll> temp = polymul(a,b);

		scanf("%d", &q);
		while (q--) {
			int x; scanf("%d", &x);
			if (x < 0 || temp.size() < x + 1)
				printf("0\n");
			else
				printf("%lld\n", temp[x]);
		}
	}

	return 0;
}