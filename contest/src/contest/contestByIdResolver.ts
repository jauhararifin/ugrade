import { ApolloError } from 'apollo-server-core'
import { AppFieldResolver } from 'ugrade/resolvers'
import { ContestModel, ContestStore, NoSuchContest } from './store'

export type ContestByIdResolver = AppFieldResolver<
  any,
  { id: string },
  Promise<ContestModel>
>

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
