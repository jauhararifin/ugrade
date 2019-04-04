/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UserInput } from "./../../../../types/graphql-global-types";

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
  user: UserInput;
}
