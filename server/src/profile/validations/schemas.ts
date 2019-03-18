import * as yup from 'yup'

export const idSchema = yup
  .string()
  .matches(/^[a-zA-Z0-9]+$/, 'Should contain alphanumeric characters only')
  .length(32)

export const addressSchema = yup.string().max(255)
