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
import { createUserResolvers } from './user'
import { UserStore } from './user/store'

export function createResolvers(
  contestStore: ContestStore,
  languageStore: LanguageStore,
  userStore: UserStore,
  authStore: AuthStore,
  profileStore: ProfileStore
): IResolvers {
  const contestResolvers = createContestResolvers(contestStore)
  const languageResolvers = createLanguageResolvers(languageStore)
  const userResolvers = createUserResolvers(userStore)
  const authResolvers = createAuthResolvers(userStore, authStore, contestStore)
  const profileResolvers = createProfileResolvers(
    profileStore,
    authStore,
    userStore
  )
  return merge(
    contestResolvers,
    languageResolvers,
    userResolvers,
    authResolvers,
    profileResolvers
  ) as any
}
