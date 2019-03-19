import * as yup from 'yup'

export const idSchema = yup
  .string()
  .matches(/^[a-zA-Z0-9]+$/, 'Should contain alphanumeric characters only')
  .length(32)

export const clarificationIdSchema = idSchema

export const clarificationEntryIdSchema = idSchema

export const titleSchema = yup
  .string()
  .label('Title')
  .max(255)

export const subjectSchema = yup
  .string()
  .label('Subject')
  .max(255)

export const contentSchema = yup
  .string()
  .label('Content')
  .max(4 * 1024)
