/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateContest
// ====================================================

export interface CreateContest_createContest_admin {
  __typename: "UserType";
  id: string;
}

export interface CreateContest_createContest_contest {
  __typename: "ContestType";
  id: string;
}

export interface CreateContest_createContest {
  __typename: "CreateContest";
  admin: CreateContest_createContest_admin | null;
  contest: CreateContest_createContest_contest | null;
}

export interface CreateContest {
  createContest: CreateContest_createContest | null;
}

export interface CreateContestVariables {
  email: string;
  shortId: string;
  name: string;
  shortDescription: string;
}
