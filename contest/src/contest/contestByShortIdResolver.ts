import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { ContestModel, ContestStore, NoSuchContest } from './store'

export type ContestByShortIdResolver = AppFieldResolver<
  any,
  { shortId: string },
  Promise<ContestModel>
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
