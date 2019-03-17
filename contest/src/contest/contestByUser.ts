import { ApolloError } from 'apollo-server-core'
import { IFieldResolver } from 'graphql-tools'
import { UserModel } from 'ugrade/auth/store'
import { ContestModel, ContestStore, NoSuchContest } from './store'

export type ContestByUserResolver = IFieldResolver<
  UserModel,
  any,
  Promise<ContestModel>
>

export function contestByUserResolver(
  store: ContestStore
): ContestByUserResolver {
  return async parent => {
    try {
      return await store.getContestById(parent.contestId)
    } catch (error) {
      if (error instanceof NoSuchContest) {
        throw new ApolloError('No Such Contest', 'NO_SUCH_CONTEST')
      }
      throw error
    }
  }
}
