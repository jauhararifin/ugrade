import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'

export const announcementIdSchema = uuidSchema

export const titleSchema = yup
  .string()
  .label('Title')
  .max(255)
  .required()

export const contentSchema = yup
  .string()
  .label('Content')
  .max(4 * 1024)
  .required()
