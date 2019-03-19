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
  UsersByContest,
} from './authResolvers'
import {
  ContestByIdResolver,
  ContestByShortIdResolver,
  CreateContestResolver,
  createContestResolvers,
  SetMyContestResolver,
  ContestByUserResolver,
} from './contestResolvers'
import {
  AllLanguageResolver,
  createLanguageResolvers,
  LanguageByIdResolver,
  PermittedLanguageResolver,
} from './languageResolvers'
import {
  createProfileResolvers,
  SetMyProfileResolver,
  UserProfileResolver,
  ProfileByUserResolver,
} from './profileResolvers'

export type AppFieldResolver<TSource = any, TArgs = any, TReturn = any> = (
  source: TSource,
  args: TArgs,
  context: AppContext,
  info: GraphQLResolveInfo & {
    mergeInfo: MergeInfo
  }
) => TReturn

export interface AppResolver {
  Query: {
    user: UserByTokenResolver
    userById: UserByIdResolver
    contestById: ContestByIdResolver
    contestByShortId: ContestByShortIdResolver
    languages: AllLanguageResolver
    languageById: LanguageByIdResolver
    userProfile: UserProfileResolver
  }
  Mutation: {
    signin: SigninResolver
    signup: SignupResolver
    forgotPassword: ForgotPasswordResolver
    resetPassword: ResetPasswordResolver
    addUser: AddUserResolver
    setMyPassword: SetMyPasswordResolver
    setMyName: SetMyNameResolver
    setPermissions: SetPermissionsResolver
    setMyProfile: SetMyProfileResolver
    createContest: CreateContestResolver
    setMyContest: SetMyContestResolver
  }
  Contest: {
    permittedLanguages: PermittedLanguageResolver
    userByEmail: UserByEmailResolver
    userByUsername: UserByUsernameResolver
    users: UsersByContest
  }
  User: {
    profile: ProfileByUserResolver
    contest: ContestByUserResolver
  }
}

export function createResolvers(
  authService: AuthService,
  languageService: LanguageService,
  profileService: ProfileService,
  contestService: ContestService
): AppResolver {
  const languageResolvers = createLanguageResolvers(languageService)
  const authResolvers = createAuthResolvers(authService)
  const profileResolvers = createProfileResolvers(profileService)
  const contestResolvers = createContestResolvers(contestService)
  return merge(
    languageResolvers,
    authResolvers,
    profileResolvers,
    contestResolvers
  )
}
