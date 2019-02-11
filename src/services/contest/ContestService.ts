import { Announcement } from './Announcement'
import { Contest } from './Contest'

export type AnnouncementSubscribeCallback = (
  announcements: Announcement[]
) => any

export type AnnouncementUbsubscribeFunction = () => any

export interface ContestService {
  getAllContests(): Promise<Contest[]>
  getContestById(id: number): Promise<Contest>
  getAccouncementsByContestId(contestId: number): Promise<Announcement[]>

  subscribeAnnouncements(
    contestId: number,
    callback: AnnouncementSubscribeCallback
  ): AnnouncementUbsubscribeFunction

  readAnnouncements(token: string, id: number[]): Promise<void>
}
