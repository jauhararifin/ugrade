import { AuthStore } from 'ugrade/auth/store'
import { LanguageStore } from 'ugrade/language/store'
import { ContestByIdResolver, contestByIdResolver } from './contestByIdResolver'
import {
  ContestByShortIdResolver,
  contestByShortIdResolver,
} from './contestByShortIdResolver'
import { ContestByUserResolver, contestByUserResolver } from './contestByUser'
import {
  CreateContestResolver,
  createContestResolver,
} from './createContestResolver'
import {
  SetMyContestResolver,
  setMyContestResolver,
} from './setMyContestResolver'
import { ContestStore } from './store'

export interface ContestResolvers {
  Query: {
    contestById: ContestByIdResolver
    contestByShortId: ContestByShortIdResolver
  }
  Mutation: {
    createContest: CreateContestResolver
    setMyContest: SetMyContestResolver
  }
  User: {
    contest: ContestByUserResolver
  }
}

export const createContestResolvers = (
  contestStore: ContestStore,
  authStore: AuthStore,
  languageStore: LanguageStore
): ContestResolvers => ({
  Query: {
    contestById: contestByIdResolver(contestStore),
    contestByShortId: contestByShortIdResolver(contestStore),
  },
  Mutation: {
    createContest: createContestResolver(
      contestStore,
      authStore,
      languageStore
    ),
    setMyContest: setMyContestResolver(contestStore, authStore, languageStore),
  },
  User: {
    contest: contestByUserResolver(contestStore),
  },
})
