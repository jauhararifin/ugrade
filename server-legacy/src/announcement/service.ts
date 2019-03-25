import { Announcement } from './announcement'

export interface AnnouncementService {
  getContestAnnouncements(token: string, contestId: string): Promise<Announcement[]>
  createAnnouncement(token: string, title: string, content: string): Promise<Announcement>
  readAnnouncement(token: string, announcementId: string): Promise<Announcement>
}
