/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentContest
// ====================================================

export interface CurrentContest_contest {
  __typename: "ContestType";
  name: string;
  shortDescription: string;
}

export interface CurrentContest {
  contest: CurrentContest_contest;
}

export interface CurrentContestVariables {
  contestId: string;
}
