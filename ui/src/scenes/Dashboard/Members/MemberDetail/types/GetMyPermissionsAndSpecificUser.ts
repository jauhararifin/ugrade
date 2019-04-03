/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMyPermissionsAndSpecificUser
// ====================================================

export interface GetMyPermissionsAndSpecificUser_me {
  __typename: "UserType";
  id: string;
  permissions: string[];
}

export interface GetMyPermissionsAndSpecificUser_user {
  __typename: "UserType";
  id: string;
  username: string | null;
  name: string | null;
  email: string;
  permissions: string[];
}

export interface GetMyPermissionsAndSpecificUser {
  me: GetMyPermissionsAndSpecificUser_me;
  user: GetMyPermissionsAndSpecificUser_user;
}

export interface GetMyPermissionsAndSpecificUserVariables {
  userId: string;
}
