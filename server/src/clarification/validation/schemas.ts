import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'

export const clarificationIdSchema = uuidSchema

export const clarificationEntryIdSchema = uuidSchema

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
