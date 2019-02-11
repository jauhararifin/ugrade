import { AuthService } from '../auth'
import { Announcement } from './Announcement'
import { Contest } from './Contest'
import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
  ContestService,
} from './ContestService'
import { NoSuchContest } from './errors'
import { annoucements, contests } from './fixtures'

export class InMemoryContestService implements ContestService {
  private authService: AuthService
  private contests: Contest[] = []

  constructor(authService: AuthService) {
    this.authService = authService

    this.contests = contests
    this.contests.forEach(
      contest => (contest.announcements = annoucements.slice())
    )
  }

  async getAllContests(): Promise<Contest[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return this.contests
  }

  async getContestById(id: number): Promise<Contest> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (id === 0) throw new Error('Connection Error')

    const contest = contests
      .slice()
      .filter(x => x.id === id)
      .pop()
    if (contest) return contest
    throw new NoSuchContest('No Such Contest')
  }

  async getAccouncementsByContestId(
    contestId: number
  ): Promise<Announcement[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (contestId === 0) throw new Error('Connection Error')
    if (!this.contests[contestId]) throw new NoSuchContest('No Such Contest')
    const contest = this.contests[contestId]
    if (contest.announcements) {
      return contest.announcements.slice()
    }
    return []
  }

  async readAnnouncements(token: string, id: number[]): Promise<void> {
    await this.authService.getMe(token)
    annoucements
      .filter(i => id.includes(i.id))
      .forEach(val => (val.read = true))
  }

  subscribeAnnouncements(
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

      const arr = (this.contests[contestId].announcements || []).slice()
      arr.push(newAnnouncement)
      this.contests[contestId].announcements = arr

      const announcements = await this.getAccouncementsByContestId(contestId)
      callback(announcements)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }
}
