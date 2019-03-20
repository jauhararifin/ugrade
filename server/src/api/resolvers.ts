import { GraphQLResolveInfo } from 'graphql'
import { MergeInfo } from 'graphql-tools'
import { merge } from 'lodash'
import { AnnouncementService } from 'ugrade/announcement'
import { AuthService } from 'ugrade/auth'
import { ClarificationService } from 'ugrade/clarification'
import { ContestService } from 'ugrade/contest'
import { AppContext } from 'ugrade/context'
import { LanguageService } from 'ugrade/language'
import { ProfileService } from 'ugrade/profile/service'
import {
  AnnouncementsByContestResolver,
  CreateAnnouncementResolver,
  createAnnouncementResolvers,
  ReadAnnouncementResolver,
} from './announcementResolvers'
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
  UserByAnnouncementResolver,
  UserByEmailResolver,
  UserByIdResolver,
  UserByTokenResolver,
  UserByUsernameResolver,
  UsersByContestResolver,
} from './authResolvers'
import {
  ClarificationByEntryResolver,
  ClarificationsByContestResolver,
  ContestByClarificationResolver,
  CreateClarificationResolver,
  createClarificationResolvers,
  EntryByClarificationResolver,
  ReadClarificationEntryResolver,
  ReplyClarificationResolver,
  UserByClarificationResolver,
  UserByEntryResolver,
} from './clarificationResolvers'
import {
  ContestByAnnouncementResolver,
  ContestByIdResolver,
  ContestByShortIdResolver,
  ContestByUserResolver,
  CreateContestResolver,
  createContestResolvers,
  SetMyContestResolver,
} from './contestResolvers'
import {
  AllLanguageResolver,
  createLanguageResolvers,
  LanguageByIdResolver,
  PermittedLanguageResolver,
} from './languageResolvers'
import {
  createProfileResolvers,
  ProfileByUserResolver,
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
    createAnnouncement: CreateAnnouncementResolver
    readAnnouncement: ReadAnnouncementResolver
    createClarification: CreateClarificationResolver
    replyClarification: ReplyClarificationResolver
    readClarificationEntry: ReadClarificationEntryResolver
  }
  Contest: {
    permittedLanguages: PermittedLanguageResolver
    userByEmail: UserByEmailResolver
    userByUsername: UserByUsernameResolver
    users: UsersByContestResolver
    announcements: AnnouncementsByContestResolver
    clarifications: ClarificationsByContestResolver
  }
  User: {
    profile: ProfileByUserResolver
    contest: ContestByUserResolver
  }
  Announcement: {
    contest: ContestByAnnouncementResolver
    issuer: UserByAnnouncementResolver
  }
  Clarification: {
    issuer: UserByClarificationResolver
    contest: ContestByClarificationResolver
    entries: EntryByClarificationResolver
  }
  ClarificationEntry: {
    sender: UserByEntryResolver
    clarification: ClarificationByEntryResolver
  }
}

export function createResolvers(
  authService: AuthService,
  languageService: LanguageService,
  profileService: ProfileService,
  contestService: ContestService,
  announcementService: AnnouncementService,
  clarificationService: ClarificationService
): AppResolver {
  const languageResolvers = createLanguageResolvers(languageService)
  const authResolvers = createAuthResolvers(authService)
  const profileResolvers = createProfileResolvers(profileService)
  const contestResolvers = createContestResolvers(contestService)
  const announcementResolvers = createAnnouncementResolvers(announcementService)
  const clarificationResolvers = createClarificationResolvers(clarificationService, authService, contestService)
  return merge(
    languageResolvers,
    authResolvers,
    profileResolvers,
    contestResolvers,
    announcementResolvers,
    clarificationResolvers
  )
}
