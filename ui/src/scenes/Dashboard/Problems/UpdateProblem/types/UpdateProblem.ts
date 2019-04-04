/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { ProblemModificationInput } from "./../../../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateProblem
// ====================================================

export interface UpdateProblem_updateProblem {
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

export interface UpdateProblem {
  updateProblem: UpdateProblem_updateProblem | null;
}

export interface UpdateProblemVariables {
  problemId: string;
  problem: ProblemModificationInput;
}
