import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { AuthStore, NoSuchUser, UserModel } from './store'

export type UserByUsernameResolver = AppFieldResolver<
  any,
  { contestId: string; username: string },
  Promise<UserModel>
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
