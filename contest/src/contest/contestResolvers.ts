import { ContestStore } from './store'
import { IFieldResolver } from 'graphql-tools'
import { AppContext } from '../context'

export interface ContestResolvers {
  contest: IFieldResolver<any, AppContext, any>
  contestById: IFieldResolver<any, any, { id: string }>
  contestByShortId: IFieldResolver<any, any, { shortId: string }>
}

export const createContestResolvers = (
  store: ContestStore
): ContestResolvers => ({
  contest: (_parent, _args, { authToken }) => {
    return null
  },

  contestById: (_parent, { id }) => {
    return store.getContestById(id)
  },

  contestByShortId: (_parent, { shortId }) => {
    return store.getContestByShortId(shortId)
  },
})
