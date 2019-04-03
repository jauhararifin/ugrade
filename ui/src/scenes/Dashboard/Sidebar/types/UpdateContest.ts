/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateContest
// ====================================================

export interface UpdateContest_updateContest {
  __typename: "ContestType";
  id: string;
  name: string;
  shortDescription: string;
}

export interface UpdateContest {
  updateContest: UpdateContest_updateContest;
}

export interface UpdateContestVariables {
  name?: string | null;
  shortDescription?: string | null;
}
