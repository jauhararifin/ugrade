import { User } from 'ugrade/auth'
import { Contest, ContestService } from 'ugrade/contest'
import { AppFieldResolver } from './resolvers'
import { wrap } from './wrap'
import { Announcement } from 'ugrade/announcement'

export type ContestByIdResolver = AppFieldResolver<
  any,
  { id: string },
  Promise<Contest>
>

export type ContestByShortIdResolver = AppFieldResolver<
  any,
  { shortId: string },
  Promise<Contest>
>

export type ContestByUserResolver = AppFieldResolver<
  User,
  any,
  Promise<Contest>
>

export type SetMyContestResolver = AppFieldResolver<
  any,
  {
    name: string
    shortDescription: string
    description: string
    startTime: Date
    freezed: boolean
    finishTime: Date
    permittedLanguageIds: string[]
  },
  Promise<Contest>
>

export type CreateContestResolver = AppFieldResolver<
  any,
  {
    email: string
    shortId: string
    name: string
    shortDescription: string
    description: string
    startTime: Date
    finishTime: Date
    permittedLanguageIds: string[]
  },
  Promise<Contest>
>

export type ContestByAnnouncementResolver = AppFieldResolver<
  Announcement,
  any,
  Promise<Contest>
>

export interface ContestResolvers {
  Query: {
    contestById: ContestByIdResolver
    contestByShortId: ContestByShortIdResolver
  }
  Mutation: {
    createContest: CreateContestResolver
    setMyContest: SetMyContestResolver
  }
  User: {
    contest: ContestByUserResolver
  }
  Announcement: {
    contest: ContestByAnnouncementResolver
  }
}

export const createContestResolvers = (
  contestService: ContestService
): ContestResolvers => ({
  Query: {
    contestById: (_source, { id }) => wrap(contestService.getContestById(id)),
    contestByShortId: (_source, { shortId }) =>
      wrap(contestService.getContestByShortId(shortId)),
  },
  Mutation: {
    createContest: (
      _source,
      {
        email,
        shortId,
        name,
        shortDescription,
        description,
        startTime,
        finishTime,
        permittedLanguageIds,
      }
    ) =>
      wrap(
        contestService.createContest(
          email,
          shortId,
          name,
          shortDescription,
          description,
          startTime,
          finishTime,
          permittedLanguageIds
        )
      ),
    setMyContest: (
      _source,
      {
        name,
        shortDescription,
        description,
        startTime,
        freezed,
        finishTime,
        permittedLanguageIds,
      },
      { authToken }
    ) =>
      wrap(
        contestService.setMyContest(
          authToken,
          name,
          shortDescription,
          description,
          startTime,
          freezed,
          finishTime,
          permittedLanguageIds
        )
      ),
  },
  User: {
    contest: source => wrap(contestService.getContestById(source.contestId)),
  },
  Announcement: {
    contest: ({ contestId }) => wrap(contestService.getContestById(contestId)),
  },
})
