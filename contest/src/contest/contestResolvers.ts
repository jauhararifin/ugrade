import { ContestStore, NoSuchContest } from './store'
import { IFieldResolver } from 'graphql-tools'
import { UserModel } from '../user/store'
import { NO_SUCH_CONTEST } from './errors'

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
    contestById: (_parent, { id }) => {
      try {
        return store.getContestById(id)
      } catch (error) {
        if (error instanceof NoSuchContest) throw NO_SUCH_CONTEST
        throw error
      }
    },

    contestByShortId: (_parent, { shortId }) => {
      try {
        return store.getContestByShortId(shortId)
      } catch (error) {
        store.getContestByShortId(shortId)
        if (error instanceof NoSuchContest) throw NO_SUCH_CONTEST
        throw error
      }
    },
  },

  User: {
    contest: parent => {
      try {
        return store.getContestById(parent.contestId)
      } catch (error) {
        if (error instanceof NoSuchContest) throw NO_SUCH_CONTEST
        throw error
      }
    },
  },
})
