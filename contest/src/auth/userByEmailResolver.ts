import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { AuthStore, NoSuchUser } from './store'

export type UserByEmailResolver = IFieldResolver<
  any,
  any,
  { contestId: string; email: string }
>

export function userByEmailResolver(store: AuthStore): UserByEmailResolver {
  return async (_source, { contestId, email }) => {
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
