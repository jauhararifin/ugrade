import * as yup from 'yup'

export const announcementIdSchema = yup
  .string()
  .matches(/^[a-zA-Z0-9]+$/, 'Should contain alphanumeric characters only')
  .length(32)

export const titleSchema = yup
  .string()
  .label('Title')
  .required()

export const contentSchema = yup
  .string()
  .label('Content')
  .required()
