/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SignUp
// ====================================================

export interface SignUp_signUp {
  __typename: "SignUpResult";
  token: string;
}

export interface SignUp {
  signUp: SignUp_signUp | null;
}

export interface SignUpVariables {
  userId: string;
  signupCode: string;
  username: string;
  name: string;
  password: string;
}
