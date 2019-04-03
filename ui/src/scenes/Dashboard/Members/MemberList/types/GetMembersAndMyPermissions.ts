/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMembersAndMyPermissions
// ====================================================

export interface GetMembersAndMyPermissions_me {
  __typename: "UserType";
  id: string;
  permissions: string[];
}

export interface GetMembersAndMyPermissions_myContest_members {
  __typename: "UserType";
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  permissions: string[];
}

export interface GetMembersAndMyPermissions_myContest {
  __typename: "ContestType";
  members: GetMembersAndMyPermissions_myContest_members[];
}

export interface GetMembersAndMyPermissions {
  me: GetMembersAndMyPermissions_me;
  myContest: GetMembersAndMyPermissions_myContest;
}
