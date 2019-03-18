import * as yup from 'yup'

export const idSchema = yup
  .string()
  .matches(/[a-zA-Z0-9]+/, 'Should contain alphanumeric characters only')
  .length(32)

export const contestShortIdSchema = yup
  .string()
  .min(4)
  .max(255)
  .label('Contest ID')
  .matches(
    /[a-zA-Z0-9\-]+/,
    'Contest ID contains alphanumeric and dash character only'
  )

export const contestNameSchema = yup
  .string()
  .max(255)
  .label('Contest Name')

export const contestShortDescriptionSchema = yup
  .string()
  .max(255)
  .label('Short Description')

export const contestDescriptionSchema = yup
  .string()
  .max(1024 * 1024)
  .label('Description')

export const startTimeSchema = yup.date().label('Contest Starting Time')

export const finishTimeSchema = yup
  .date()
  .label('Contest Finish Time')
  .min(yup.ref('startTime'))

export const freezedSchema = yup.bool()

export const permittedLanguagesSchema = yup
  .array()
  .of(idSchema)
  .label('Permitted Languages')
