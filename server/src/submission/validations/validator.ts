import { tokenSchema } from 'ugrade/auth/validations'
import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'
import { sourceCodeSchema } from './schemas'

export const submissionServiceValidator = {
  getContestSubmissions: (token: string, contestId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        contestId: uuidSchema.required(),
      })
      .validate({ token, contestId }),
  createSubmission: (token: string, problemId: string, languageId: string, sourceCode: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        problemId: uuidSchema.required(),
        languageId: uuidSchema.required(),
        sourceCode: sourceCodeSchema.required(),
      })
      .validate({ token, problemId, languageId, sourceCode }),
}
