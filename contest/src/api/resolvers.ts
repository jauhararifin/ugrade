import { GraphQLResolveInfo } from 'graphql'
import { MergeInfo } from 'graphql-tools'
import { merge } from 'lodash'
import { AuthService } from 'ugrade/auth2'
import { AppContext } from 'ugrade/context'
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

  // contestById: ContestByIdResolver
  // contestByShortId: ContestByShortIdResolver

  // languages: AllLanguageResolver
  // languageById: LanguageByIdResolver

  // profile: ProfileByTokenResolver
  // userProfile: UserProfileResolver
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

  // setMyProfile: SetMyProfileResolver

  // setMyContest: SetMyContestResolver
  // createContest: CreateContestResolver
}

export interface AppResolver {
  Query: AppQueryResolver
  Mutation: AppMutationResolver
}

export function createResolvers(authService: AuthService): AppResolver {
  //   const contestResolvers = createContestResolvers(
  //     contestStore,
  //     authStore,
  //     languageStore
  //   )
  //   const languageResolvers = createLanguageResolvers(languageStore)
  const authResolvers = createAuthResolvers(authService)
  //   const profileResolvers = createProfileResolvers(profileStore, authStore)
  return merge(
    // contestResolvers,
    // languageResolvers,
    authResolvers
    // profileResolvers
  )
}
