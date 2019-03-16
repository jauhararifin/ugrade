import { UserStore } from './store'
import { IFieldResolver } from 'graphql-tools'
import { AppContext } from '../context'
import { ContestModel } from '../contest/store'

export interface UserResolvers {
  Query: {
    user: IFieldResolver<any, AppContext, any>
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
    user: () => null,
    userById: (_source, { id }) => store.getUserById(id),
    userByEmail: (_source, { contestId, email }) =>
      store.getUserByEmail(contestId, email),
    userByUsername: (_source, { contestId, username }) =>
      store.getUserByUsername(contestId, username),
  },
  Contest: {
    users: ({ id }) => store.getUsersInContest(id),
  },
})
