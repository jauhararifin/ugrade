import { ContestByIdResolver, contestByIdResolver } from './contestByIdResolver'
import {
  ContestByShortIdResolver,
  contestByShortIdResolver,
} from './contestByShortIdResolver'
import { ContestByUserResolver } from './contestByUser'
import { ContestStore } from './store'

export interface ContestResolvers {
  Query: {
    contestById: ContestByIdResolver
    contestByShortId: ContestByShortIdResolver
  }
  User: {
    contest: ContestByUserResolver
  }
}

export const createContestResolvers = (
  store: ContestStore
): ContestResolvers => ({
  Query: {
    contestById: contestByIdResolver(store),
    contestByShortId: contestByShortIdResolver(store),
  },
  User: {
    contest: contestByIdResolver(store),
  },
})
