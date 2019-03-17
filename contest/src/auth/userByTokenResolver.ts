import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { AuthStore, NoSuchUser, UserModel } from './store'

export type UserByTokenResolver = IFieldResolver<any, any, Promise<UserModel>>

export function userByTokenResolver(store: AuthStore): UserByTokenResolver {
  return async (_parent, _args, { authToken }) => {
    try {
      return await store.getUserByToken(authToken)
    } catch (error) {
      if (error instanceof NoSuchUser) {
        throw new ApolloError('Invalid Token', 'INVALID_TOKEN')
      }
      throw error
    }
  }
}
