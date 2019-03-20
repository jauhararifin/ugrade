import { Announcement, AnnouncementService } from 'ugrade/announcement'
import { Contest } from 'ugrade/contest'
import { AppFieldResolver } from './resolvers'
import { wrap } from './wrap'

export type AnnouncementsByContestResolver = AppFieldResolver<Contest, any, Promise<Announcement[]>>

export type CreateAnnouncementResolver = AppFieldResolver<
  any,
  {
    title: string
    content: string
  },
  Promise<Announcement>
>

export type ReadAnnouncementResolver = AppFieldResolver<any, { id: string }, Promise<Announcement>>

export interface AnnouncementResolvers {
  Mutation: {
    createAnnouncement: CreateAnnouncementResolver
    readAnnouncement: ReadAnnouncementResolver
  }
  Contest: {
    announcements: AnnouncementsByContestResolver
  }
}

export const createAnnouncementResolvers = (announcementService: AnnouncementService): AnnouncementResolvers => ({
  Mutation: {
    createAnnouncement: (_source, { title, content }, { authToken }) =>
      wrap(announcementService.createAnnouncement(authToken, title, content)),
    readAnnouncement: (_source, { id }, { authToken }) => wrap(announcementService.readAnnouncement(authToken, id)),
  },
  Contest: {
    announcements: ({ id }, _args, { authToken }) => wrap(announcementService.getContestAnnouncements(authToken, id)),
  },
})
