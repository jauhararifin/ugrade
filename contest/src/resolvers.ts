import { GraphQLResolveInfo } from 'graphql'
import { IResolvers, MergeInfo } from 'graphql-tools'
import { merge } from 'lodash'
import { createAuthResolvers } from './auth'
import { AuthStore } from './auth/store'
import { createContestResolvers } from './contest'
import { ContestStore } from './contest/store'
import { AppContext } from './context'
import { createLanguageResolvers } from './language/languageResolvers'
import { LanguageStore } from './language/store'
import { createProfileResolvers } from './profile'
import { ProfileStore } from './profile/store'

export type AppFieldResolver<TSource, TArgs, TReturn = any> = (
  source: TSource,
  args: TArgs,
  context: AppContext,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo
  }
) => TReturn

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
