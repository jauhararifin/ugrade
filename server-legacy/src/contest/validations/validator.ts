import { emailSchema, nameSchema, tokenSchema } from 'ugrade/auth/validations'
import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'
import {
  contestDescriptionSchema,
  contestNameSchema,
  contestShortDescriptionSchema,
  contestShortIdSchema,
  finishTimeSchema,
  freezedSchema,
  permittedLanguagesSchema,
  startTimeSchema,
} from './schemas'

export const contestServiceValidator = {
  getContestById: (id: string) =>
    yup
      .object()
      .shape({
        id: uuidSchema.required(),
      })
      .validate({ id }),
  getContestByShortId: (shortId: string) =>
    yup
      .object()
      .shape({
        shortId: contestShortIdSchema.required(),
      })
      .validate({ shortId }),
  createContest: (
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguageIds: string[]
  ) =>
    yup
      .object()
      .shape({
        email: emailSchema.required(),
        shortId: contestShortIdSchema.required(),
        name: nameSchema.required(),
        shortDescription: contestShortDescriptionSchema.required(),
        description: contestShortDescriptionSchema.required(),
        startTime: startTimeSchema.required(),
        finishTime: finishTimeSchema.required(),
        permittedLanguageIds: permittedLanguagesSchema.required(),
      })
      .validate({
        email,
        shortId,
        name,
        shortDescription,
        description,
        startTime,
        finishTime,
        permittedLanguageIds,
      }),
  setMyContest: (
    token: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    freezed: boolean,
    finishTime: Date,
    permittedLanguageIds: string[]
  ) =>
    yup
      .object()
      .shape({
        token: tokenSchema.required(),
        name: contestNameSchema.required(),
        shortDescription: contestShortDescriptionSchema.required(),
        description: contestDescriptionSchema.required(),
        startTime: startTimeSchema.required(),
        freezed: freezedSchema.required(),
        finishTime: finishTimeSchema.required(),
        permittedLanguageIds: permittedLanguagesSchema.required(),
      })
      .validate({
        token,
        name,
        shortDescription,
        description,
        startTime,
        freezed,
        finishTime,
        permittedLanguageIds,
      }),
}
