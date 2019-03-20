import * as yup from 'yup'
import { ProblemType } from '../problem'

export const shortIdSchema = yup
  .string()
  .label('Problem ID')
  .min(4)
  .max(255)
  .matches(
    /[a-zA-Z0-9\-]+/,
    'Must contain alpha numeric or dash character only'
  )

export const nameSchema = yup
  .string()
  .label('Problem Name')
  .min(4)
  .max(255)

export const statementSchema = yup
  .string()
  .max(4 * 1024)
  .label('Problem Statement')

export const typeSchema = yup
  .string()
  .oneOf([ProblemType.Batch, ProblemType.Interactive])

export const disabledSchema = yup.bool()

export const timeLimitSchema = yup
  .number()
  .label('Time Limit')
  .integer()
  .min(1000)
  .max(10000)

export const toleranceSchema = yup
  .number()
  .label('Tolerance Factor')
  .min(0.1)
  .max(10)

export const memoryLimitSchema = yup
  .number()
  .label('Memory Limit')
  .integer()
  .min(16 * 1024 * 1024)
  .max(512 * 1024 * 1024)

export const outputLimitSchema = yup
  .number()
  .label('Output Limit')
  .integer()
  .min(1)
  .max(512 * 1024 * 1024)
