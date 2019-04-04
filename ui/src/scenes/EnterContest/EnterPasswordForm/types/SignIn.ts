/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignIn
// ====================================================

export interface SignIn_signIn {
  __typename: "SignInResult";
  token: string;
}

export interface SignIn {
  signIn: SignIn_signIn | null;
}

export interface SignInVariables {
  userId: string;
  password: string;
}
