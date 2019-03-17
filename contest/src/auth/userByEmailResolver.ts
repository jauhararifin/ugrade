import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { AuthStore, NoSuchUser, UserModel } from './store'

export type UserByEmailResolver = AppFieldResolver<
  any,
  { contestId: string; email: string },
  Promise<UserModel>
>

export function userByEmailResolver(store: AuthStore): UserByEmailResolver {
  return async (_source, { contestId, email }): Promise<UserModel> => {
    try {
      return await store.getUserByEmail(contestId, email)
    } catch (error) {
      if (error instanceof NoSuchUser) {
        throw new ApolloError('No Such User', 'NO_SUCH_USER')
      }
      throw error
    }
  }
}
