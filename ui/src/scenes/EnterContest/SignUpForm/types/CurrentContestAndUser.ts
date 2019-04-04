/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CurrentContestAndUser
// ====================================================

export interface CurrentContestAndUser_contest {
  __typename: "ContestType";
  name: string;
  shortDescription: string;
}

export interface CurrentContestAndUser_user {
  __typename: "UserType";
  username: string | null;
}

export interface CurrentContestAndUser {
  contest: CurrentContestAndUser_contest;
  user: CurrentContestAndUser_user;
}

export interface CurrentContestAndUserVariables {
  contestId: string;
  userId: string;
}
