import { tokenSchema } from 'ugrade/auth/validations'
import { idSchema } from 'ugrade/contest/validations'
import * as yup from 'yup'
import {
  clarificationEntryIdSchema,
  clarificationIdSchema,
  contentSchema,
  subjectSchema,
  titleSchema,
} from './schemas'

export const clarificationServiceValidator = {
  getClarificationById: (token: string, clarificationId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        clarificationId: clarificationIdSchema.required(),
      })
      .validate({ token, clarificationId }),

  getClarificationEntries: (token: string, clarificationId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        clarificationId: clarificationIdSchema.required(),
      })
      .validate({ token, clarificationId }),

  getContestClarifications: (token: string, contestId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        contestId: idSchema.required(),
      })
      .validate({ token, contestId }),

  createClarification: (
    token: string,
    title: string,
    subject: string,
    content: string
  ) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        title: titleSchema.required(),
        subject: subjectSchema.required(),
        content: contentSchema.required(),
      })
      .validate({ token, title, subject, content }),

  readClarificationEntry: (token: string, clarificationEntryId: string) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        clarificationEntryId: clarificationEntryIdSchema.required(),
      })
      .validate({ token, clarificationEntryId }),
}
