/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProblemInput } from "./../../../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: CreateProblem
// ====================================================

export interface CreateProblem_createProblem {
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

export interface CreateProblem {
  createProblem: CreateProblem_createProblem;
}

export interface CreateProblemVariables {
  problem: ProblemInput;
}
