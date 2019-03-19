import * as yup from 'yup'

export const addressSchema = yup.string().max(255)
