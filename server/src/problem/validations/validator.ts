import { nameSchema, tokenSchema } from 'ugrade/auth/validations'
import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'
import { ProblemType } from '../problem'
import {
  disabledSchema,
  memoryLimitSchema,
  outputLimitSchema,
  shortIdSchema,
  statementSchema,
  timeLimitSchema,
  toleranceSchema,
  typeSchema,
} from './schemas'

export const problemServiceValidator = {
  getContestProblems: (token: string, contestId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        contestId: uuidSchema.required(),
      })
      .validate({ token, contestId }),

  getContestProblemById: (token: string, contestId: string, problemId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        contestId: uuidSchema.required(),
        problemId: uuidSchema.required(),
      })
      .validate({ token, contestId, problemId }),

  createProblem: (
    token: string,
    shortId: string,
    name: string,
    statement: string,
    type: ProblemType,
    disabled: boolean,
    timeLimit: number,
    tolerance: number,
    memoryLimit: number,
    outputLimit: number
  ) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        shortId: shortIdSchema.required(),
        name: nameSchema.required(),
        statement: statementSchema.required(),
        type: typeSchema.required(),
        disabled: disabledSchema.required(),
        timeLimit: timeLimitSchema.required(),
        tolerance: toleranceSchema.required(),
        memoryLimit: memoryLimitSchema.required(),
        outputLimit: outputLimitSchema.required(),
      })
      .validate({
        token,
        shortId,
        name,
        statement,
        type,
        disabled,
        timeLimit,
        tolerance,
        memoryLimit,
        outputLimit,
      }),

  updateProblem: (
    token: string,
    problemId: string,
    name: string,
    statement: string,
    type: ProblemType,
    disabled: boolean,
    order: number,
    timeLimit: number,
    tolerance: number,
    memoryLimit: number,
    outputLimit: number
  ) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        problemId: uuidSchema.required(),
        name: nameSchema.required(),
        statement: statementSchema.required(),
        type: typeSchema.required(),
        disabled: disabledSchema.required(),
        order: yup
          .number()
          .integer()
          .required(),
        timeLimit: timeLimitSchema.required(),
        tolerance: toleranceSchema.required(),
        memoryLimit: memoryLimitSchema.required(),
        outputLimit: outputLimitSchema.required(),
      })
      .validate({
        token,
        problemId,
        name,
        statement,
        type,
        disabled,
        order,
        timeLimit,
        tolerance,
        memoryLimit,
        outputLimit,
      }),

  deleteProblem: (token: string, problemId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        problemId: uuidSchema.required(),
      })
      .validate({ token, problemId }),
}
