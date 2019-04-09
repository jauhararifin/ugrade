#include <bits/stdc++.h>

using namespace std;

int main() {
  ios::sync_with_stdio(0);
  while(1) {
    cout<<(rand() % 26 + 'a');
    if (rand()%100 == 0) {
      cout<<endl;
    }
  }
  return 0;
}
