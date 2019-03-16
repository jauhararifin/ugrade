import { IResolvers } from 'graphql-tools'
import { merge } from 'lodash'
import { createAuthResolvers } from './auth'
import { AuthStore } from './auth/store'
import { createContestResolvers } from './contest'
import { ContestStore } from './contest/store'
import { createLanguageResolvers } from './language/languageResolvers'
import { LanguageStore } from './language/store'
import { createProfileResolvers } from './profile'
import { ProfileStore } from './profile/store'

export function createResolvers(
  contestStore: ContestStore,
  languageStore: LanguageStore,
  authStore: AuthStore,
  profileStore: ProfileStore
): IResolvers {
  const contestResolvers = createContestResolvers(contestStore)
  const languageResolvers = createLanguageResolvers(languageStore)
  const authResolvers = createAuthResolvers(authStore)
  const profileResolvers = createProfileResolvers(profileStore, authStore)
  return merge(
    contestResolvers,
    languageResolvers,
    authResolvers,
    profileResolvers
  ) as any
}
