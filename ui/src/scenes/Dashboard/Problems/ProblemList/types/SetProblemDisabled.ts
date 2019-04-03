/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetProblemDisabled
// ====================================================

export interface SetProblemDisabled_updateProblem {
  __typename: "ProblemType";
  id: string;
  disabled: boolean;
}

export interface SetProblemDisabled {
  updateProblem: SetProblemDisabled_updateProblem | null;
}

export interface SetProblemDisabledVariables {
  problemId: string;
  disabled: boolean;
}
