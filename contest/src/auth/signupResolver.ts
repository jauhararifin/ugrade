import { ApolloError } from 'apollo-server-core'
import { hash } from 'bcrypt'
import { AppFieldResolver } from 'ugrade/resolvers'
import * as yup from 'yup'
import { AuthStore, NoSuchUser } from './store'
import { userByEmailResolver } from './userByEmailResolver'
import { genToken } from './util'
import {
  nameSchema,
  oneTimeCodeSchema,
  passwordSchema,
  usernameSchema,
} from './validationSchema'

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
      username: usernameSchema,
      name: nameSchema,
      oneTimeCode: oneTimeCodeSchema,
      password: passwordSchema,
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
