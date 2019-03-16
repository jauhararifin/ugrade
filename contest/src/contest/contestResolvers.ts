import { ContestStore } from './store'
import { IFieldResolver } from 'graphql-tools'
import { AppContext } from '../context'
import { UserModel } from '../user/store'

export interface ContestResolvers {
  Query: {
    contest: IFieldResolver<any, AppContext, any>
    contestById: IFieldResolver<any, any, { id: string }>
    contestByShortId: IFieldResolver<any, any, { shortId: string }>
  }
  User: {
    contest: IFieldResolver<UserModel, any, any>
  }
}

export const createContestResolvers = (
  store: ContestStore
): ContestResolvers => ({
  Query: {
    contest: (_parent, _args, { authToken }) => {
      return null
    },

    contestById: (_parent, { id }) => store.getContestById(id),

    contestByShortId: (_parent, { shortId }) =>
      store.getContestByShortId(shortId),
  },

  User: {
    contest: parent => store.getContestById(parent.contestId),
  },
})
