/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SubmitSolution
// ====================================================

export interface SubmitSolution_submitSolution {
  __typename: "SubmissionType";
  id: string;
}

export interface SubmitSolution {
  submitSolution: SubmitSolution_submitSolution | null;
}

export interface SubmitSolutionVariables {
  problemId: string;
  languageId: string;
  sourceCode: any;
}
