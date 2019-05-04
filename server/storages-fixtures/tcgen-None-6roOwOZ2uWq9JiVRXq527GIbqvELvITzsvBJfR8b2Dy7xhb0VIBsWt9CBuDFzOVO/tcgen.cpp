#include <bits/stdc++.h>

using namespace std;

unsigned int sample_count()
{
  return 1;
}

unsigned int testcase_count()
{
  return 3;
}

void sample(unsigned int sample_id)
{
  cout << "5" << endl;
  cout << "1 6 2 3 4" << endl;
  cout << "8 2 4 5 7" << endl;
  cout << "3" << endl;
  cout << "3" << endl;
  cout << "6" << endl;
  cout << "5" << endl;
}

void print_arr_line(vector<int> &arr)
{
  for (int i = 0; i < arr.size() - 1; i++)
    cout << arr[i] << " ";
  cout << arr[arr.size() - 1] << endl;
}

void print_case(int N, vector<int> a, vector<int> b, vector<int> c, int Q)
{
  cout << N << endl;
  print_arr_line(a);
  print_arr_line(b);
  cout << Q << endl;
  for (int i = 0; i < Q; i++)
    cout << c[i] << endl;
}

void random_with_max_a_b(int n, int maxab, int q, int &N, int &Q, vector<int> &a, vector<int> &b, vector<int> &c)
{
  N = n;
  Q = q;
  vector<int> numbers;
  for (int i = 0; i <= maxab; i++)
    numbers.push_back(i);

  swap(numbers[0], numbers[numbers.size() - 1]);
  random_shuffle(numbers.begin() + 1, numbers.end());
  for (int i = 0; i < N; i++)
    a.push_back(numbers[i]);
  random_shuffle(numbers.begin() + 1, numbers.end());
  for (int i = 0; i < N; i++)
    b.push_back(numbers[i]);

  for (int i = 0; i < Q / 3; i++)
    c.push_back(abs(rand()));
  for (int i = 0; i < Q / 3; i++)
    c.push_back(abs(rand()) % (maxab + 1));
  while (c.size() < Q)
  {
    int va = a[rand() % a.size()];
    int vb = b[rand() % b.size()];
    c.push_back(va + vb);
  }
}

void random_with_max_a_b_with_some_duplicate(int n, int maxab, int q, int &N, int &Q, vector<int> &a, vector<int> &b, vector<int> &c)
{
  N = n;
  Q = q;

  vector<int> numbers;
  for (int i = 0; i <= maxab; i++)
    numbers.push_back(i);

  swap(numbers[0], numbers[numbers.size() - 1]);
  random_shuffle(numbers.begin() + 1, numbers.end());
  for (int i = 0; i < 2 * N / 3; i++)
    a.push_back(numbers[i]);
  while (a.size() < N)
    a.push_back(a[rand() % (2 * N / 3)]);
  random_shuffle(numbers.begin() + 1, numbers.end());
  for (int i = 0; i < 2 * N / 3; i++)
    b.push_back(numbers[i]);
  while (b.size() < N)
    b.push_back(b[rand() % (2 * N / 3)]);

  for (int i = 0; i < Q / 3; i++)
    c.push_back(abs(rand()));
  for (int i = 0; i < Q / 3; i++)
    c.push_back(abs(rand()) % (maxab + 1));
  while (c.size() < Q)
  {
    int va = a[rand() % a.size()];
    int vb = b[rand() % b.size()];
    c.push_back(va + vb);
  }
}

void random_tc(int n, int q, int &N, int &Q, vector<int> &a, vector<int> &b, vector<int> &c)
{ // N > Q
  N = n;
  Q = q;

  for (int i = 0; i < N; i++)
    a.push_back(rand() % 50001);
  for (int i = 0; i < N; i++)
    b.push_back(rand() % 50001);

  unordered_set<int> used;
  for (int i = 0; i < Q; i++)
  {
    int va = a[rand() % a.size()];
    int vb = b[rand() % b.size()];
    used.insert(va + vb);
  }

  if (used.size() < Q)
    used.insert(0);

  while (used.size() < Q)
    used.insert(abs(rand()));

  for (int x : used)
    c.push_back(x);
}

void worst_tc(int &N, int &Q, vector<int> &a, vector<int> &b, vector<int> &c)
{
  N = 50000;
  for (int i = 0; i < 50000; i++)
    a.push_back(i), b.push_back(i);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  Q = 100000;
  for (int i = 0; i < 50000; i++)
    c.push_back(i), c.push_back(99998 - i);
}

void testcase(unsigned int tc_id)
{
  int T = 19;
  cout << T << endl;

  print_case(1, {0}, {0}, {0, 1, 2, 3, 4, 100, 1000000}, 7);
  print_case(4, {0, 1, 2, 3}, {9, 8, 7, 6}, {0, 1, 2, 3, 6, 7, 8, 9, 100, 200}, 10);
  print_case(3, {4, 7, 1}, {0, 1, 5}, {4, 5, 9, 7, 8, 12, 1, 2, 6, 0, 15, 1000000}, 12);
  print_case(5, {1, 7, 8, 9, 11}, {12, 6, 5, 4, 2}, {4, 5, 9, 7, 8, 13, 1, 2, 6, 0, 15, 1000000}, 12);
  print_case(5, {1, 1, 1, 1, 1}, {10, 10, 10, 10, 10}, {0, 1, 10, 11, 12}, 5);

  vector<int> a, b, c;
  int N, Q;

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b(10, 20, 50, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b(20, 20, 50, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b_with_some_duplicate(50, 100, 50, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b(100, 1000, 400, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b_with_some_duplicate(200, 1000, 400, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b(500, 1000, 400, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b_with_some_duplicate(1000, 10000, 2000, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b(2000, 10000, 4000, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b(5000, 10000, 10000, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b_with_some_duplicate(10000, 50000, 100000, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_with_max_a_b(20000, 50000, 100000, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_tc(10000, 20000, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  random_tc(20000, 30000, N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);

  a.clear();
  b.clear();
  c.clear();
  worst_tc(N, Q, a, b, c);
  random_shuffle(a.begin(), a.end());
  random_shuffle(b.begin(), b.end());
  random_shuffle(c.begin(), c.end());
  print_case(N, a, b, c, Q);
}

int main(int argc, char **argv)
{
  ios::sync_with_stdio(false);
  cin.tie(0);
  if (argc < 2)
    return -1;
  string action = argv[1];
  if (action == "sample_count")
  {
    cout << sample_count() << endl;
  }
  else if (action == "testcase_count")
  {
    cout << testcase_count() << endl;
  }
  else if (action == "sample")
  {
    if (argc < 3)
    {
      cerr << "Please provide sample id" << endl;
      return -1;
    }
    unsigned int sample_id;
    sscanf(argv[2], "%d", &sample_id);
    sample(sample_id);
  }
  else if (action == "testcase")
  {
    if (argc < 3)
    {
      cerr << "Please provide testcase id" << endl;
      return -1;
    }
    unsigned int tc_id;
    sscanf(argv[2], "%d", &tc_id);
    testcase(tc_id);
  }
  return 0;
}