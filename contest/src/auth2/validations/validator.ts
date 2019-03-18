import {
  emailSchema,
  nameSchema,
  passwordSchema,
  usernameSchema,
} from 'ugrade/auth/validationSchema'
import * as yup from 'yup'
import { Permission } from '../user'
import { idSchema, oneTimeCodeSchema } from './validationSchemas'

export const authServiceValidator = {
  signin: (contestId: string, email: string, password: string) =>
    yup
      .object()
      .shape({
        contestId: idSchema.required(),
        email: emailSchema.required(),
        password: passwordSchema.required(),
      })
      .validate({ contestId, email, password }),

  signup: (
    contestId: string,
    username: string,
    email: string,
    oneTimeCode: string,
    password: string,
    name: string
  ) =>
    yup
      .object()
      .shape({
        contestId: idSchema.required(),
        username: usernameSchema.required(),
        name: nameSchema.required(),
        email: emailSchema.required(),
        oneTimeCode: oneTimeCodeSchema.required(),
        password: passwordSchema.required(),
      })
      .validate({
        contestId,
        username,
        name,
        email,
        oneTimeCode,
        password,
      }),

  forgotPassword: (contestId: string, email: string) =>
    yup
      .object()
      .shape({
        contestId: idSchema.required(),
        email: emailSchema.required(),
      })
      .validate({ contestId, email }),

  resetPassword: (
    contestId: string,
    email: string,
    oneTimeCode: string,
    password: string
  ) =>
    yup
      .object()
      .shape({
        contestId: idSchema.required(),
        email: emailSchema.required(),
        oneTimeCode: oneTimeCodeSchema.required(),
        password: passwordSchema.required(),
      })
      .validate({ contestId, email, oneTimeCode, password }),

  addUser: (token: string, email: string, permissions: Permission[]) =>
    yup
      .object()
      .shape({
        token: idSchema.required(),
        email: emailSchema.required(),
        permissions: yup.array().required(),
      })
      .validate({ token, email, permissions }),

  setMyPassword: (token: string, oldPassword: string, newPassword: string) =>
    yup
      .object()
      .shape({
        token: idSchema.required(),
        oldPassword: passwordSchema.required(),
        newPassword: passwordSchema.required(),
      })
      .validate({ token, oldPassword, newPassword }),

  setMyName: (token: string, name: string) =>
    yup
      .object()
      .shape({
        token: idSchema.required(),
        name: nameSchema.required(),
      })
      .validate({ token, name }),

  setPermissions: (token: string, userId: string, permissions: Permission[]) =>
    yup
      .object()
      .shape({
        token: idSchema.required(),
        userId: idSchema.required(),
        permissions: yup.array().required(),
      })
      .validate({ token, permissions }),

  getMe: (token: string) => idSchema.required().validate(token),

  getUserById: (id: string) => idSchema.required().validate(id),

  getUserByEmail: (contestId: string, email: string) =>
    yup
      .object()
      .shape({
        contestId: idSchema.required(),
        email: emailSchema.required(),
      })
      .validate({ contestId, email }),

  getUserByUsername: (contestId: string, username: string) =>
    yup
      .object()
      .shape({
        contestId: idSchema.required(),
        username: usernameSchema.required(),
      })
      .validate({ contestId, username }),
}
