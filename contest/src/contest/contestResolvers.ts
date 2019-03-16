import { ContestStore } from './store'
import { IFieldResolver } from 'graphql-tools'

export interface ContestResolvers {
  Query: {
    contest: IFieldResolver<any, any, { id: string }>
    contestByShortId: IFieldResolver<any, any, { shortId: string }>
  }
}

export const createContestResolvers = (
  store: ContestStore
): ContestResolvers => ({
  Query: {
    contest: (_parent, { id }) => {
      return store.getContestById(id)
    },
    contestByShortId: (_parent, { shortId }) => {
      return store.getContestByShortId(shortId)
    },
  },
})
