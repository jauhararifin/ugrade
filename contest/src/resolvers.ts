import { IResolvers } from 'graphql-tools'
import { createContestResolvers } from './contest'
import { ContestStore } from './contest/store'
import { LanguageStore } from './language/store'
import { createLanguageResolvers } from './language/languageResolvers'
import { merge } from 'lodash'
import { UserStore } from './user/store'
import { createUserResolvers } from './user'
import { AuthStore } from './auth/store'
import { createAuthResolvers } from './auth'

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
