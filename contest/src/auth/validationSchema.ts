import * as yup from 'yup'

export const usernameSchema = yup
  .string()
  .label('Username')
  .matches(
    /[a-zA-Z0-9\-]+/,
    'Should contain alphanumeric and dash character only'
  )
  .min(4)
  .max(255)
  .required()

export const nameSchema = yup
  .string()
  .label('Name')
  .min(4)
  .max(255)
  .required()

export const oneTimeCodeSchema = yup
  .string()
  .label('One Time Code')
  .matches(/.{8}/, 'Invalid One Time Code')
  .required()

export const passwordSchema = yup
  .string()
  .label('Password')
  .min(8)
  .max(255)
  .required()

export const emailSchema = yup
  .string()
  .email()
  .label('Email')
  .required()
