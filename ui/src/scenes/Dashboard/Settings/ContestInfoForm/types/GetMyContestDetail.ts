/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyContestDetail
// ====================================================

export interface GetMyContestDetail_myContest_permittedLanguages {
  __typename: "LanguageType";
  id: string;
  name: string;
}

export interface GetMyContestDetail_myContest {
  __typename: "ContestType";
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  startTime: any;
  finishTime: any;
  freezed: boolean;
  permittedLanguages: GetMyContestDetail_myContest_permittedLanguages[];
  gradingSize: number;
}

export interface GetMyContestDetail {
  myContest: GetMyContestDetail_myContest;
}
