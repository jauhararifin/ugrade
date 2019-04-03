/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProblemListAndMyPermissions
// ====================================================

export interface GetProblemListAndMyPermissions_problems {
  __typename: "ProblemType";
  id: string;
  name: string;
  disabled: boolean;
}

export interface GetProblemListAndMyPermissions_me {
  __typename: "UserType";
  id: string;
  permissions: string[];
}

export interface GetProblemListAndMyPermissions {
  problems: GetProblemListAndMyPermissions_problems[];
  me: GetProblemListAndMyPermissions_me;
}
