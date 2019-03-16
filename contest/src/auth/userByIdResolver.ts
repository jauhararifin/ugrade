import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { AuthStore, NoSuchUser } from './store'

export type UserByIdResolver = IFieldResolver<any, any, { id: string }>

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
