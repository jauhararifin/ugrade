import * as yup from 'yup'

export const sourceCodeSchema = yup
  .string()
  .label('Source Code')
  .url()
  .max(1024)
