/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ForgotPassword
// ====================================================

export interface ForgotPassword_forgotPassword {
  __typename: "UserType";
  id: string;
}

export interface ForgotPassword {
  forgotPassword: ForgotPassword_forgotPassword | null;
}

export interface ForgotPasswordVariables {
  userId: string;
}
