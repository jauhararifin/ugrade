/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface ContestInput {
  name: string;
  shortId: string;
  shortDescription: string;
  description?: string | null;
  startTime?: any | null;
  freezed?: boolean | null;
  finishTime?: any | null;
  gradingSize?: number | null;
}

export interface ProblemInput {
  shortId: string;
  name: string;
  statement: string;
  disabled: boolean;
  timeLimit: number;
  tolerance: number;
  memoryLimit: number;
  outputLimit: number;
}

export interface ProblemModificationInput {
  shortId?: string | null;
  name?: string | null;
  statement?: string | null;
  disabled?: boolean | null;
  timeLimit?: number | null;
  tolerance?: number | null;
  memoryLimit?: number | null;
  outputLimit?: number | null;
}

export interface UpdateContestInput {
  name?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  startTime?: any | null;
  freezed?: boolean | null;
  finishTime?: any | null;
  permittedLanguages?: (string | null)[] | null;
  gradingSize?: number | null;
}

export interface UserInput {
  username: string;
  name: string;
  password: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
