#include <bits/stdc++.h>
#include <unistd.h>

using namespace std;

int main()
{
  ios::sync_with_stdio(0);
  int n = 4 * 1024;
  char *buff = (char *)malloc(n);
  while (1)
  {
    for (int i = 0; i < n; i++)
      buff[i] = rand() % 26 + 'a';
    buff[n - 1] = 0;
    printf("%s\n", buff);
    fflush(stdout);
  }
  free(buff);
  return 0;
}
