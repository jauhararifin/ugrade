import { GraphQLResolveInfo } from 'graphql'
import { MergeInfo } from 'graphql-tools'
import { merge } from 'lodash'
import {
  createAuthResolvers,
  UserByEmailResolver,
  UserByIdResolver,
  UserByTokenResolver,
  UserByUsernameResolver,
} from './auth'
import { AddUserResolver } from './auth/addUserResolver'
import { ForgotPasswordResolver } from './auth/forgotPasswordResolver'
import { ResetPasswordResolver } from './auth/resetPasswordResolver'
import { SetMyNameResolver } from './auth/setMyNameResolver'
import { SetMyPasswordResolver } from './auth/setMyPasswordResolver'
import { SetPermissionsResolver } from './auth/setPermissionsResolver'
import { SigninResolver } from './auth/signinResolver'
import { SignupResolver } from './auth/signupResolver'
import { AuthStore } from './auth/store'
import {
  ContestByIdResolver,
  ContestByShortIdResolver,
  createContestResolvers,
} from './contest'
import { CreateContestResolver } from './contest/createContestResolver'
import { SetMyContestResolver } from './contest/setMyContestResolver'
import { ContestStore } from './contest/store'
import { AppContext } from './context'
import { AllLanguageResolver, LanguageByIdResolver } from './language'
import { createLanguageResolvers } from './language/languageResolvers'
import { LanguageStore } from './language/store'
import {
  createProfileResolvers,
  ProfileByTokenResolver,
  SetMyProfileResolver,
  UserProfileResolver,
} from './profile'
import { ProfileStore } from './profile/store'

export type AppFieldResolver<TSource = any, TArgs = any, TReturn = any> = (
  source: TSource,
  args: TArgs,
  context: AppContext,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo
  }
) => TReturn

export interface AppQueryResolver {
  user: UserByTokenResolver
  userById: UserByIdResolver
  userByEmail: UserByEmailResolver
  userByUsername: UserByUsernameResolver

  contestById: ContestByIdResolver
  contestByShortId: ContestByShortIdResolver

  languages: AllLanguageResolver
  languageById: LanguageByIdResolver

  profile: ProfileByTokenResolver
  userProfile: UserProfileResolver
}

export interface AppMutationResolver {
  signin: SigninResolver
  signup: SignupResolver
  forgotPassword: ForgotPasswordResolver
  resetPassword: ResetPasswordResolver
  addUser: AddUserResolver
  setMyPassword: SetMyPasswordResolver
  setMyName: SetMyNameResolver
  setPermissions: SetPermissionsResolver

  setMyProfile: SetMyProfileResolver

  setMyContest: SetMyContestResolver
  createContest: CreateContestResolver
}

export interface AppResolver {
  Query: AppQueryResolver
  Mutation: AppMutationResolver
}

export function createResolvers(
  contestStore: ContestStore,
  languageStore: LanguageStore,
  authStore: AuthStore,
  profileStore: ProfileStore
): AppResolver {
  const contestResolvers = createContestResolvers(
    contestStore,
    authStore,
    languageStore
  )
  const languageResolvers = createLanguageResolvers(languageStore)
  const authResolvers = createAuthResolvers(authStore)
  const profileResolvers = createProfileResolvers(profileStore, authStore)
  return merge(
    contestResolvers,
    languageResolvers,
    authResolvers,
    profileResolvers
  )
}
