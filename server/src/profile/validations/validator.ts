import { tokenSchema } from 'ugrade/auth/validations'
import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'
import { GenderType, ShirtSizeType } from '../profile'
import { addressSchema } from './schemas'

export const profileServiceValidator = {
  getUserProfile: (token: string, userId: string) =>
    yup
      .object()
      .shape({ token: tokenSchema.required(), userId: uuidSchema.required() })
      .validate({ token, userId }),

  setMyProfile: (
    token: string,
    _gender?: GenderType,
    _shirtSize?: ShirtSizeType,
    address?: string
  ) =>
    yup
      .object()
      .shape({
        token: uuidSchema.required(),
        address: addressSchema,
      })
      .validate({ token, address }),
}
