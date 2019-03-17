import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { AuthStore, NoSuchUser, UserModel } from './store'

export type UserByIdResolver = AppFieldResolver<
  any,
  { id: string },
  Promise<UserModel>
>

export function userByIdResolver(store: AuthStore): UserByIdResolver {
  return async (_source, { id }) => {
    try {
      return await store.getUserById(id)
    } catch (error) {
      if (error instanceof NoSuchUser) {
        throw new ApolloError('No Such User', 'NO_SUCH_USER')
      }
      throw error
    }
  }
}
