import { AuthService, ForbiddenActionError } from '../auth'
import { Announcement } from './Announcement'
import { Clarification, ClarificationEntry } from './Clarification'
import { Contest, ContestDetail } from './Contest'
import {
  AnnouncementSubscribeCallback,
  AnnouncementUbsubscribeFunction,
  ClarificationSubscribeCallback,
  ClarificationUnsubscribeFunction,
  ContestService,
  ProblemIdsSubscribeCallback,
  ProblemIdsUnsubscribeFunction,
} from './ContestService'
import {
  ContestAlreadyStarted,
  NoSuchClarification,
  NoSuchContest,
} from './errors'
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
  private contestClarificationsMap: { [id: number]: Clarification[] } = {}

  constructor(authService: AuthService) {
    this.authService = authService

    this.contests = contests.slice()
    this.contestProblemsMap = { ...contestProblemsMap }
    this.contestAnnouncementsMap = { ...contestAnnouncementsMap }

    this.contests.forEach(
      contest =>
        (this.contestClarificationsMap[contest.id] = [
          {
            id: Math.round(Math.random() * 100000),
            title: 'Lorem Ipsum',
            subject: 'General Issue',
            issuedTime: new Date(),
            entries: [
              {
                id: Math.round(Math.random() * 100000),
                sender: 'test',
                read: true,
                issuedTime: new Date(),
                content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
              },
            ],
          },
        ])
    )
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

  async getContestClarifications(
    token: string,
    contestId: number
  ): Promise<Clarification[]> {
    await this.authService.getMe(token)
    await this.getContestDetailById(contestId)
    return this.contestClarificationsMap[contestId].slice()
  }

  async subscribeContestClarifications(
    token: string,
    contestId: number,
    callback: ClarificationSubscribeCallback
  ): Promise<ClarificationUnsubscribeFunction> {
    await this.authService.getMe(token)
    const contest = await this.getContestDetailById(contestId)
    if (!contest.registered) {
      throw new ForbiddenActionError('Cannot access contest clarification')
    }

    const runThis = async () => {
      const arr = await this.getContestClarifications(token, contestId)
      for (const clarif of arr) {
        const newEntry: ClarificationEntry = {
          id: Math.round(Math.random() * 100000),
          sender: 'jury',
          content: `Some random content ${Math.random()}`,
          read: false,
          issuedTime: new Date(),
        }
        clarif.entries.push(newEntry)
      }

      const clarifications = await this.getContestClarifications(
        token,
        contestId
      )
      callback(clarifications)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async createContestClarification(
    token: string,
    contestId: number,
    title: string,
    subject: string,
    content: string
  ): Promise<void> {
    const user = await this.authService.getMe(token)
    const contest = await this.getContestDetailById(contestId)
    if (!contest.registered) {
      throw new ForbiddenActionError('Cannot access contest clarification')
    }

    const clarification: Clarification = {
      id: Math.round(Math.random() * 100000),
      title,
      subject,
      issuedTime: new Date(),
      entries: [
        {
          id: Math.round(Math.random() * 100000),
          sender: user.username,
          content,
          read: true,
          issuedTime: new Date(),
        },
      ],
    }

    this.contestClarificationsMap[contest.id].push(clarification)
  }

  async createContestClarificationEntry(
    token: string,
    clarificationId: number,
    content: string
  ): Promise<void> {
    const user = await this.authService.getMe(token)
    let contest: Contest | undefined
    let clarification: Clarification | undefined
    for (const cid in this.contestClarificationsMap) {
      if (this.contestClarificationsMap.hasOwnProperty(cid)) {
        const clarifs = this.contestClarificationsMap[cid]
        const clarif = clarifs.filter(temp => temp.id === clarificationId).pop()
        if (clarif !== undefined) {
          clarification = clarif
          contest = this.contests[cid]
          break
        }
      }
    }

    if (!contest) {
      throw new NoSuchContest('No Such Contest')
    }

    if (!clarification) {
      throw new NoSuchClarification('No Such Clarification')
    }

    if (!contest.registered) {
      throw new ForbiddenActionError('You Are Not Registered To The Contest')
    }

    if (new Date() >= contest.finishTime) {
      throw new ForbiddenActionError('Contest Already Finished')
    }

    clarification.entries.push({
      id: Math.round(Math.random() * 100000),
      sender: user.username,
      issuedTime: new Date(),
      read: true,
      content,
    })
  }
}
