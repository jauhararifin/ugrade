/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProblemList
// ====================================================

export interface GetProblemList_problems {
  __typename: "ProblemType";
  id: string;
  name: string;
  disabled: boolean;
}

export interface GetProblemList {
  problems: GetProblemList_problems[];
}
