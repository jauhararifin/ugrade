import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { ContestStore, NoSuchContest } from './store'

export type ContestByIdResolver = IFieldResolver<any, any, { id: string }>

export function contestByIdResolver(store: ContestStore): ContestByIdResolver {
  return async (_parent, { id }) => {
    try {
      return await store.getContestById(id)
    } catch (error) {
      if (error instanceof NoSuchContest) {
        throw new ApolloError('No Such Contest', 'NO_SUCH_CONTEST')
      }
      throw error
    }
  }
}
