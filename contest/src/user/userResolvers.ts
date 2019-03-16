import { IFieldResolver } from 'graphql-tools'
import { ContestModel } from 'ugrade/contest/store'
import { NO_SUCH_USER } from './errors'
import { NoSuchUser, UserStore } from './store'

export interface UserResolvers {
  Query: {
    userById: IFieldResolver<any, any, { id: string }>
    userByEmail: IFieldResolver<any, any, { contestId: string; email: string }>
    userByUsername: IFieldResolver<
      any,
      any,
      { contestId: string; username: string }
    >
  }
  Contest: {
    users: IFieldResolver<ContestModel, any, any>
  }
}

export const createUserResolvers = (store: UserStore): UserResolvers => ({
  Query: {
    userById: async (_source, { id }) => {
      try {
        return await store.getUserById(id)
      } catch (error) {
        if (error instanceof NoSuchUser) throw NO_SUCH_USER
        throw error
      }
    },

    userByEmail: async (_source, { contestId, email }) => {
      try {
        return await store.getUserByEmail(contestId, email)
      } catch (error) {
        if (error instanceof NoSuchUser) throw NO_SUCH_USER
        throw error
      }
    },
    userByUsername: async (_source, { contestId, username }) => {
      try {
        return await store.getUserByUsername(contestId, username)
      } catch (error) {
        if (error instanceof NoSuchUser) throw NO_SUCH_USER
        throw error
      }
    },
  },
  Contest: {
    users: ({ id }) => store.getUsersInContest(id),
  },
})
