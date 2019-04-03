/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InviteUsers
// ====================================================

export interface InviteUsers_inviteUsers {
  __typename: "UserType";
  id: string;
  username: string | null;
  name: string | null;
}

export interface InviteUsers {
  inviteUsers: InviteUsers_inviteUsers[];
}

export interface InviteUsersVariables {
  emails: string[];
  permissions: string[];
}
