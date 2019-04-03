/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyContest
// ====================================================

export interface GetMyContest_myContest_problems {
  __typename: "ProblemType";
  id: string;
  name: string;
}

export interface GetMyContest_myContest_permittedLanguages {
  __typename: "LanguageType";
  id: string;
  name: string;
  extensions: (string | null)[];
}

export interface GetMyContest_myContest {
  __typename: "ContestType";
  id: string;
  problems: GetMyContest_myContest_problems[];
  permittedLanguages: GetMyContest_myContest_permittedLanguages[];
}

export interface GetMyContest {
  myContest: GetMyContest_myContest;
}
