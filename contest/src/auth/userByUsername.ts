import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { AuthStore, NoSuchUser } from './store'

export type UserByUsernameResolver = IFieldResolver<
  any,
  any,
  { contestId: string; username: string }
>

export function userByUsernameResolver(
  store: AuthStore
): UserByUsernameResolver {
  return async (_source, { contestId, username }) => {
    try {
      return await store.getUserByUsername(contestId, username)
    } catch (error) {
      if (error instanceof NoSuchUser) {
        throw new ApolloError('Invalid Token', 'INVALID_TOKEN')
      }
      throw error
    }
  }
}
