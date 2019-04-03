/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProblemStatement
// ====================================================

export interface GetProblemStatement_problem {
  __typename: "ProblemType";
  id: string;
  name: string;
  statement: string;
}

export interface GetProblemStatement {
  problem: GetProblemStatement_problem;
}

export interface GetProblemStatementVariables {
  problemId: string;
}
