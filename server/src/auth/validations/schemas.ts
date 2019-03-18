import * as yup from 'yup'

export const idSchema = yup
  .string()
  .matches(/^[a-zA-Z0-9]+$/, 'Should contain alphanumeric characters only')
  .length(32)

export const usernameSchema = yup
  .string()
  .label('Username')
  .matches(
    /^[a-zA-Z0-9\-]+$/,
    'Should contain alphanumeric and dash character only'
  )
  .min(4)
  .max(255)

export const nameSchema = yup
  .string()
  .label('Name')
  .min(4)
  .max(255)

export const oneTimeCodeSchema = yup
  .string()
  .label('One Time Code')
  .matches(/^[a-zA-Z0-9]+$/, 'Invalid One Time Code')
  .length(8)

export const passwordSchema = yup
  .string()
  .label('Password')
  .min(8)
  .max(255)

export const emailSchema = yup
  .string()
  .email()
  .label('Email')
