/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProblemDetail
// ====================================================

export interface ProblemDetail_problem {
  __typename: "ProblemType";
  id: string;
  shortId: string;
  name: string;
  statement: string;
  disabled: boolean;
  timeLimit: number;
  tolerance: number;
  memoryLimit: number;
  outputLimit: number;
}

export interface ProblemDetail {
  problem: ProblemDetail_problem;
}

export interface ProblemDetailVariables {
  problemId: string;
}
