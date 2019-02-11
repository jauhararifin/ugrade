import { Problem } from '../problem'
import { Announcement } from './Announcement'
import { Contest, ContestDetail } from './Contest'

export type AnnouncementSubscribeCallback = (
  announcements: Announcement[]
) => any

export type AnnouncementUbsubscribeFunction = () => any

export interface ContestService {
  getAllContests(): Promise<Contest[]>
  getContestDetailById(id: number): Promise<ContestDetail>

  getContestAnnouncements(contestId: number): Promise<Announcement[]>

  subscribeContestAnnouncements(
    contestId: number,
    callback: AnnouncementSubscribeCallback
  ): AnnouncementUbsubscribeFunction

  readContestAnnouncements(
    token: string,
    contestId: number,
    id: number[]
  ): Promise<void>

  getContestProblems(token: string, contestId: number): Promise<Problem[]>
}
