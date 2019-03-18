import { GraphQLResolveInfo } from 'graphql'
import { MergeInfo } from 'graphql-tools'
import { merge } from 'lodash'
import { AuthService } from 'ugrade/auth'
import { ContestService } from 'ugrade/contest'
import { AppContext } from 'ugrade/context'
import { LanguageService } from 'ugrade/language'
import { ProfileService } from 'ugrade/profile/service'
import {
  AddUserResolver,
  createAuthResolvers,
  ForgotPasswordResolver,
  ResetPasswordResolver,
  SetMyNameResolver,
  SetMyPasswordResolver,
  SetPermissionsResolver,
  SigninResolver,
  SignupResolver,
  UserByEmailResolver,
  UserByIdResolver,
  UserByTokenResolver,
  UserByUsernameResolver,
} from './authResolvers'
import {
  ContestByIdResolver,
  ContestByShortIdResolver,
  CreateContestResolver,
  createContestResolvers,
  SetMyContestResolver,
} from './contestResolvers'
import {
  AllLanguageResolver,
  createLanguageResolvers,
  LanguageByIdResolver,
} from './languageResolvers'
import {
  createProfileResolvers,
  SetMyProfileResolver,
  UserProfileResolver,
} from './profileResolvers'

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

  // profile: ProfileByTokenResolver
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
  authService: AuthService,
  languageService: LanguageService,
  profileService: ProfileService,
  contestService: ContestService
): AppResolver {
  const languageResolvers = createLanguageResolvers(languageService)
  const authResolvers = createAuthResolvers(authService)
  const profileResolvers = createProfileResolvers(profileService, authService)
  const contestResolvers = createContestResolvers(contestService)
  return merge(
    languageResolvers,
    authResolvers,
    profileResolvers,
    contestResolvers
  )
}
