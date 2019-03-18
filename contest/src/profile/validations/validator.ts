import * as yup from 'yup'
import { GenderType, ShirtSizeType } from '../profile'
import { addressSchema, idSchema } from './schemas'

export const profileServiceValidator = {
  getUserProfile: (token: string, userId: string) =>
    yup
      .object()
      .shape({ token: idSchema.required(), userId: idSchema.required() })
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
        token: idSchema.required(),
        address: addressSchema,
      })
      .validate({ token, address }),
}
