[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/jauhararifin/ugrade.svg?style=svg)](https://circleci.com/gh/jauhararifin/ugrade)
![Under Development](https://img.shields.io/badge/Under-Development-yellow.svg)

# UGrade 
Simple competitive programming contest platform using contestant PC as grader

## Cloning
This repository use [Git LFS](https://git-lfs.github.com/) for storing large sandboxed filesystem. To skip downloading the large file, use `GIT_LFS_SKIP_SMUDGE=1` environment variable, e.g.: `GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/jauhararifin/ugrade`

## Motivation
To organize competitive programming competition we usually deploy several grader to handle contestant submissions. Sometimes the number of contestant is so huge that our grader cannot handle the submissions. Why don't we use contestant machine as grader instead?

### TC Generator (Temporary Design)
Every problem should have `jury solution`, `checker` and `testcase generator`. Testcase generator basically just a normal program that generate input files for grading. Testcase case generator should generate the same input file in every machine and every time (like pure function).

Grading system will ask testcase generator how many input files they should generates:
```
int main(int argc, char** argv) {
    if (argc < 2) return -1;
    
    string action = argv[1];
    if (action == "sample_count")
        cout<<sample_count()<<endl; // tells grading system how many sample input will be generated
    
    if (action == "testcase_count")
        cout<<testcase_count()<<endl;  // tells grading system how many testcase input will be generated
    
    return 0;
}
```

Grading system then run testcase generator `N` times, depending how many testcase input they provided:
```
if (action == "sample") {
    unsigned int sample_id;
    sscanf(argv[2], "%d", &sample_id);
    
    // generate sample input `sample_id`. Use stdout to output the testcase.
    sample(sample_id);
} else if (action == "testcase") {
    unsigned int tc_id;
    sscanf(argv[2], "%d", &tc_id);
    
    // generate testcase input `tc_id`. Use stdout to output the testcase.
    testcase(tc_id);
}
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
