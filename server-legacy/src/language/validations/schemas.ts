import * as yup from 'yup'

export const languageNameSchema = yup
  .string()
  .label('Name')
  .min(1)
  .max(255)
