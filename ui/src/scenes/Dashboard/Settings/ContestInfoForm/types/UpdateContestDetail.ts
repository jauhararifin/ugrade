/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { UpdateContestInput } from "./../../../../../types/graphql-global-types";

// ====================================================
// GraphQL mutation operation: UpdateContestDetail
// ====================================================

export interface UpdateContestDetail_updateContest_permittedLanguages {
  __typename: "LanguageType";
  id: string;
  name: string;
}

export interface UpdateContestDetail_updateContest {
  __typename: "ContestType";
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  startTime: any;
  finishTime: any;
  freezed: boolean;
  permittedLanguages: UpdateContestDetail_updateContest_permittedLanguages[];
  gradingSize: number;
}

export interface UpdateContestDetail {
  updateContest: UpdateContestDetail_updateContest;
}

export interface UpdateContestDetailVariables {
  contest: UpdateContestInput;
}
