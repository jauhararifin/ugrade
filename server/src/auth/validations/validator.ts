import { uuidSchema } from 'ugrade/uuid'
import * as yup from 'yup'
import { Permission } from '../user'
import { emailSchema, nameSchema, oneTimeCodeSchema, passwordSchema, usernameSchema } from './schemas'

export const authServiceValidator = {
  signin: (contestId: string, email: string, password: string) =>
    yup
      .object()
      .shape({
        contestId: uuidSchema.required(),
        email: emailSchema.required(),
        password: passwordSchema.required(),
      })
      .validate({ contestId, email, password }),

  signup: (contestId: string, username: string, email: string, oneTimeCode: string, password: string, name: string) =>
    yup
      .object()
      .shape({
        contestId: uuidSchema.required(),
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
        contestId: uuidSchema.required(),
        email: emailSchema.required(),
      })
      .validate({ contestId, email }),

  resetPassword: (contestId: string, email: string, oneTimeCode: string, password: string) =>
    yup
      .object()
      .shape({
        contestId: uuidSchema.required(),
        email: emailSchema.required(),
        oneTimeCode: oneTimeCodeSchema.required(),
        password: passwordSchema.required(),
      })
      .validate({ contestId, email, oneTimeCode, password }),

  addUser: (token: string, email: string, permissions: Permission[]) =>
    yup
      .object()
      .shape({
        token: uuidSchema.required(),
        email: emailSchema.required(),
        permissions: yup.array().required(),
      })
      .validate({ token, email, permissions }),

  addContest: (email: string, contestId: string) =>
    yup
      .object()
      .shape({
        email: emailSchema.required(),
        contestId: uuidSchema.required(),
      })
      .validate({ email, contestId }),

  setMyPassword: (token: string, oldPassword: string, newPassword: string) =>
    yup
      .object()
      .shape({
        token: uuidSchema.required(),
        oldPassword: passwordSchema.required(),
        newPassword: passwordSchema.required(),
      })
      .validate({ token, oldPassword, newPassword }),

  setMyName: (token: string, name: string) =>
    yup
      .object()
      .shape({
        token: uuidSchema.required(),
        name: nameSchema.required(),
      })
      .validate({ token, name }),

  setPermissions: (token: string, userId: string, permissions: Permission[]) =>
    yup
      .object()
      .shape({
        token: uuidSchema.required(),
        userId: uuidSchema.required(),
        permissions: yup.array().required(),
      })
      .validate({ token, permissions }),

  getMe: (token: string) => uuidSchema.required().validate(token),

  getUserById: (id: string) => uuidSchema.required().validate(id),

  getUserByEmail: (contestId: string, email: string) =>
    yup
      .object()
      .shape({
        contestId: uuidSchema.required(),
        email: emailSchema.required(),
      })
      .validate({ contestId, email }),

  getUserByUsername: (contestId: string, username: string) =>
    yup
      .object()
      .shape({
        contestId: uuidSchema.required(),
        username: usernameSchema.required(),
      })
      .validate({ contestId, username }),

  getUsersInContest: (token: string, contestId: string) =>
    yup
      .object()
      .shape({
        token: uuidSchema.required(),
        contestId: uuidSchema.required(),
      })
      .validate({ token, contestId }),
}
