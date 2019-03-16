import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { ContestStore, NoSuchContest } from './store'

export type ContestByShortIdResolver = IFieldResolver<
  any,
  any,
  { shortId: string }
>

export function contestByShortIdResolver(
  store: ContestStore
): ContestByShortIdResolver {
  return async (_parent, { shortId }) => {
    try {
      return await store.getContestByShortId(shortId)
    } catch (error) {
      if (error instanceof NoSuchContest) {
        throw new ApolloError('No Such Contest', 'NO_SUCH_CONTEST')
      }
      throw error
    }
  }
}
