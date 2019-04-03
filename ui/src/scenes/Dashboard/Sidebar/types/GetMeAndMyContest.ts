/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMeAndMyContest
// ====================================================

export interface GetMeAndMyContest_myContest {
  __typename: "ContestType";
  name: string;
  shortDescription: string;
  startTime: any;
  finishTime: any;
}

export interface GetMeAndMyContest_me {
  __typename: "UserType";
  permissions: (string | null)[];
}

export interface GetMeAndMyContest {
  myContest: GetMeAndMyContest_myContest;
  me: GetMeAndMyContest_me;
}
