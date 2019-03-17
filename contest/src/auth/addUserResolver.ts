import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import * as yup from 'yup'
import { AuthStore, NoSuchUser, Permission, UserModel } from './store'
import { userByTokenResolver } from './userByTokenResolver'
import { genId, genOTC } from './util'

export type AddUserResolver = AppFieldResolver<
  any,
  { email: string; permissions: Permission[] },
  Promise<UserModel>
>

export function addUserResolver(store: AuthStore): AddUserResolver {
  return async (source, args, context, info) => {
    const userByToken = userByTokenResolver(store)
    const user = await userByToken(source, args, context, info)

    // validate email
    const schema = yup
      .string()
      .email()
      .label('Email')
      .required()
    let email
    try {
      email = await schema.validate(args.email)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw new ApolloError('Invalid Input', 'INVALID_INPUT', error.errors)
      }
      throw error
    }

    // check user permission
    if (!user.permissions.includes(Permission.UsersInvite)) {
      throw new ApolloError('Forbidden Action', 'FORBIDDEN_ACTION')
    }

    // check given permission
    for (const perm of args.permissions) {
      if (!user.permissions.includes(perm)) {
        throw new ApolloError('Forbidden Action', 'FORBIDDEN_ACTION')
      }
    }

    // check email exists
    try {
      await store.getUserByEmail(user.contestId, email)
      throw new ApolloError('Already Invited', 'ALREADY_INVITED')
    } catch (error) {
      if (!(error instanceof NoSuchUser)) throw error
    }

    const result = await store.putUser({
      id: genId(),
      contestId: user.contestId,
      username: '',
      email: args.email,
      name: '',
      permissions: args.permissions,
      password: '',
      token: '',
      signUpCode: genOTC(),
    })

    return result
  }
}
