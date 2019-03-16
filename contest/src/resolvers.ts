import { IResolvers } from 'graphql-tools'
import { merge } from 'lodash'
import { createAuthResolvers } from './auth'
import { AuthStore } from './auth/store'
import { createContestResolvers } from './contest'
import { ContestStore } from './contest/store'
import { createLanguageResolvers } from './language/languageResolvers'
import { LanguageStore } from './language/store'
import { createUserResolvers } from './user'
import { UserStore } from './user/store'

export function createResolvers(
  contestStore: ContestStore,
  languageStore: LanguageStore,
  userStore: UserStore,
  authStore: AuthStore
): IResolvers {
  const contestResolvers = createContestResolvers(contestStore)
  const languageResolvers = createLanguageResolvers(languageStore)
  const userResolvers = createUserResolvers(userStore)
  const authResolvers = createAuthResolvers(userStore, authStore, contestStore)
  return merge(
    contestResolvers,
    languageResolvers,
    userResolvers,
    authResolvers
  ) as any
}
