/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SetEmail
// ====================================================

export interface SetEmail_user {
  __typename: "UserType";
  id: string;
  username: string | null;
}

export interface SetEmail {
  user: SetEmail_user;
}

export interface SetEmailVariables {
  contestId: string;
  email: string;
}
