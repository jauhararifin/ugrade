import { AuthService, ForbiddenActionError } from '../auth'
import { Problem } from '../problem'
import { Announcement } from './Announcement'
import { Contest, ContestDetail } from './Contest'
import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
  ContestService,
} from './ContestService'
import { NoSuchContest } from './errors'
import {
  contestAnnouncementsMap,
  contestProblemsMap,
  contests,
} from './fixtures'

export class InMemoryContestService implements ContestService {
  private authService: AuthService
  private contests: ContestDetail[] = []
  private contestProblemsMap: { [id: number]: Problem[] } = {}
  private contestAnnouncementsMap: { [id: number]: Announcement[] } = {}

  constructor(authService: AuthService) {
    this.authService = authService

    this.contests = contests.slice()
    this.contestProblemsMap = { ...contestProblemsMap }
    this.contestAnnouncementsMap = { ...contestAnnouncementsMap }
  }

  async getAllContests(): Promise<Contest[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return this.contests
  }

  async getContestDetailById(id: number): Promise<ContestDetail> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (id === 0) throw new Error('Connection Error')

    const contest = contests
      .slice()
      .filter(x => x.id === id)
      .pop()
    if (contest) return contest
    throw new NoSuchContest('No Such Contest')
  }

  async getContestAnnouncements(contestId: number): Promise<Announcement[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (contestId === 0) throw new Error('Connection Error')
    await this.getContestDetailById(contestId)
    return this.contestAnnouncementsMap[contestId].slice()
  }

  async readContestAnnouncements(
    token: string,
    contestId: number,
    id: number[]
  ): Promise<void> {
    await this.authService.getMe(token)
    await this.getContestDetailById(contestId)
    this.contestAnnouncementsMap[contestId]
      .filter(i => id.includes(i.id))
      .forEach(val => (val.read = true))
  }

  subscribeContestAnnouncements(
    contestId: number,
    callback: AnnouncementSubscribeCallback
  ): AnnouncementUbsubscribeFunction {
    const runThis = async () => {
      const newAnnouncement: Announcement = {
        id: Math.round(Math.random() * 300),
        title: `Lorem Ipsum ${Math.random()}`,
        content: `Lorem ipsum dos color sit amet`,
        issuedTime: new Date(Date.now()),
        read: false,
      }

      const arr = await this.getContestAnnouncements(contestId)
      arr.push(newAnnouncement)
      this.contestAnnouncementsMap[contestId] = arr

      const announcements = await this.getContestAnnouncements(contestId)
      callback(announcements)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async getContestProblems(
    token: string,
    contestId: number
  ): Promise<Problem[]> {
    await this.authService.getMe(token)
    const contest = await this.getContestDetailById(contestId)
    if (!contest.registered) {
      throw new ForbiddenActionError('Cannot access this contest problems')
    }
    return this.contestProblemsMap[contestId].slice()
  }
}
