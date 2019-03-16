import { IFieldResolver } from 'graphql-tools'
import { UserModel } from 'ugrade/user/store'
import { NO_SUCH_CONTEST } from './errors'
import { ContestStore, NoSuchContest } from './store'

export interface ContestResolvers {
  Query: {
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
    contestById: async (_parent, { id }) => {
      try {
        return await store.getContestById(id)
      } catch (error) {
        if (error instanceof NoSuchContest) throw NO_SUCH_CONTEST
        throw error
      }
    },

    contestByShortId: async (_parent, { shortId }) => {
      try {
        return await store.getContestByShortId(shortId)
      } catch (error) {
        if (error instanceof NoSuchContest) throw NO_SUCH_CONTEST
        throw error
      }
    },
  },

  User: {
    contest: async parent => {
      try {
        return await store.getContestById(parent.contestId)
      } catch (error) {
        if (error instanceof NoSuchContest) throw NO_SUCH_CONTEST
        throw error
      }
    },
  },
})
