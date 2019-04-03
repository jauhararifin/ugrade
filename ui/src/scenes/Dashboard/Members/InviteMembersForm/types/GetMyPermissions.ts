/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyPermissions
// ====================================================

export interface GetMyPermissions_me {
  __typename: "UserType";
  id: string;
  permissions: string[];
}

export interface GetMyPermissions {
  me: GetMyPermissions_me;
}
