import { ApolloError } from 'apollo-server-core'
import { hash } from 'bcrypt'
import { AppFieldResolver } from 'ugrade/resolvers'
import * as yup from 'yup'
import { AuthStore, NoSuchUser } from './store'
import { userByEmailResolver } from './userByEmailResolver'
import { genToken } from './util'

export type SignupResolver = AppFieldResolver<
  any,
  {
    contestId: string
    username: string
    email: string
    oneTimeCode: string
    password: string
    name: string
  },
  Promise<string>
>

export function signupResolver(store: AuthStore): SignupResolver {
  return async (source, args, context, info) => {
    const schema = yup.object().shape({
      username: yup
        .string()
        .label('Username')
        .matches(
          /[a-zA-Z0-9\-]+/,
          'Should contain alphanumeric and dash character only'
        )
        .min(4)
        .max(255)
        .required(),
      name: yup
        .string()
        .label('Name')
        .min(4)
        .max(255)
        .required(),
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

    // validate user input
    const { username, name, oneTimeCode, password } = args
    let validated
    try {
      validated = await schema.validate({
        username,
        name,
        oneTimeCode,
        password,
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ApolloError('Invalid Input', 'INVALID_INPUT', error.errors)
      }
      throw error
    }

    const userByEmail = userByEmailResolver(store)
    const user = await userByEmail(source, args, context, info)
    if (user.username !== '') {
      throw new ApolloError('User Already Registered', 'ALREADY_REGISTERED')
    }

    // check signupcode
    if (user.signUpCode && user.signUpCode !== args.oneTimeCode) {
      throw new ApolloError('Invalid One Time Code', 'INVALID_CODE')
    }

    // check used username
    try {
      await store.getUserByUsername(user.contestId, user.username)
      throw new ApolloError('Username Already Used', 'ALREADY_USED_USERNAME')
    } catch (error) {
      if (!(error instanceof NoSuchUser)) throw error
    }

    user.token = genToken()
    user.password = await hash(validated.password, 10)
    user.name = validated.name
    user.signUpCode = undefined
    user.resetPasswordCode = undefined

    const result = await store.putUser(user)
    return result.token
  }
}