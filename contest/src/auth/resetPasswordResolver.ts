import { ApolloError } from 'apollo-server-core'
import { hash } from 'bcrypt'
import { AppFieldResolver } from 'ugrade/resolvers'
import * as yup from 'yup'
import { AuthStore, UserModel } from './store'
import { userByEmailResolver } from './userByEmailResolver'

export type ResetPasswordResolver = AppFieldResolver<
  any,
  {
    contestId: string
    email: string
    oneTimeCode: string
    password: string
  },
  Promise<UserModel>
>

export function resetPasswordResolver(store: AuthStore): ResetPasswordResolver {
  return async (source, args, context, info) => {
    const schema = yup.object().shape({
      oneTimeCode: yup
        .string()
        .label('One Time Code')
        .matches(/.{8}/, 'Invalid One Time Code')
        .required(),
      password: yup
        .string()
        .label('Password')
        .min(8)
        .max(255)
        .required(),
    })

    let { oneTimeCode, password } = args
    try {
      const res = await schema.validate({ oneTimeCode, password })
      oneTimeCode = res.oneTimeCode
      password = res.password
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ApolloError('Invalid Input', 'INVALID_INPUT', error.errors)
      }
      throw error
    }

    const userByEmail = userByEmailResolver(store)
    const user = await userByEmail(source, args, context, info)

    if (user.resetPasswordCode && user.resetPasswordCode !== oneTimeCode) {
      throw new ApolloError('Invalid One Time Code', 'INVALID_CODE')
    }

    user.password = await hash(password, 10)
    user.resetPasswordCode = undefined
    return store.putUser(user)
  }
}
