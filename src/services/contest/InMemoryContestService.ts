import { AuthService, ForbiddenActionError } from '../auth'
import { Announcement } from './Announcement'
import { Contest, ContestDetail } from './Contest'
import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
  ContestService,
  ProblemIdsSubscribeCallback,
  ProblemIdsUnsubscribeFunction,
} from './ContestService'
import { ContestAlreadyStarted, NoSuchContest } from './errors'
import { AlreadyRegistered } from './errors/AlreadyRegistered'
import {
  contestAnnouncementsMap,
  contestProblemsMap,
  contests,
} from './fixtures'

export class InMemoryContestService implements ContestService {
  private authService: AuthService
  private contests: ContestDetail[] = []
  private contestProblemsMap: { [id: number]: number[] } = {}
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

  async registerContest(token: string, contestId: number): Promise<void> {
    await this.authService.getMe(token)
    const contest = await this.getContestDetailById(contestId)
    if (contest.registered) {
      throw new AlreadyRegistered('Already Registered In The Contest')
    }
    if (contest.startTime > new Date()) contest.registered = true
    else throw new ContestAlreadyStarted('Registration Is Closed')
  }

  async unregisterContest(token: string, contestId: number): Promise<void> {
    await this.authService.getMe(token)
    const contest = await this.getContestDetailById(contestId)
    if (!contest.registered) {
      throw new ForbiddenActionError('Not Yet Registered To The Contest')
    }
    if (contest.startTime > new Date()) contest.registered = false
    else throw new ContestAlreadyStarted('Contest Already Running')
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

  subscribeContestProblemIds(
    token: string,
    contestId: number,
    callback: ProblemIdsSubscribeCallback
  ): ProblemIdsUnsubscribeFunction {
    const runThis = async () => {
      const arr = await this.getContestProblemIds(token, contestId)
      if (arr.length > 0) {
        const first = arr.shift() as number
        arr.push(first)
      }
      this.contestProblemsMap[contestId] = arr

      const problemIds = await this.getContestProblemIds(token, contestId)
      callback(problemIds)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async getContestProblemIds(
    token: string,
    contestId: number
  ): Promise<number[]> {
    await this.authService.getMe(token)
    const contest = await this.getContestDetailById(contestId)
    if (!contest.registered) {
      throw new ForbiddenActionError('Cannot access this contest problems')
    }
    return this.contestProblemsMap[contestId].slice()
  }
}
