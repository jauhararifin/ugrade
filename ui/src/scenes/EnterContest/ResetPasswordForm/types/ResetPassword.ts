/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPassword
// ====================================================

export interface ResetPassword_resetPassword {
  __typename: "UserType";
  id: string;
}

export interface ResetPassword {
  resetPassword: ResetPassword_resetPassword | null;
}

export interface ResetPasswordVariables {
  userId: string;
  resetPasswordOtc: string;
  password: string;
}
