/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMySubmissions
// ====================================================

export interface GetMySubmissions_submissions_problem {
  __typename: "ProblemType";
  id: string;
  name: string;
}

export interface GetMySubmissions_submissions_language {
  __typename: "LanguageType";
  id: string;
  name: string;
}

export interface GetMySubmissions_submissions {
  __typename: "SubmissionType";
  id: string;
  problem: GetMySubmissions_submissions_problem;
  language: GetMySubmissions_submissions_language;
  verdict: string;
  issuedTime: any;
}

export interface GetMySubmissions {
  submissions: GetMySubmissions_submissions[];
}
