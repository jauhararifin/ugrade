/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMeAndMyContest
// ====================================================

export interface GetMeAndMyContest_myContest {
  __typename: "ContestType";
  id: string;
  name: string;
  shortDescription: string;
  startTime: any;
  finishTime: any;
}

export interface GetMeAndMyContest_me {
  __typename: "UserType";
  id: string;
  permissions: string[];
}

export interface GetMeAndMyContest {
  myContest: GetMeAndMyContest_myContest;
  me: GetMeAndMyContest_me;
}
