import { AuthService, ForbiddenActionError } from '../auth'
import { NoSuchProblem } from '../problem'
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
  SubmissionSubscribeCallback,
  SubmissionUnsubscribeFunction,
} from './ContestService'
import {
  ContestAlreadyStarted,
  NoSuchClarification,
  NoSuchContest,
} from './errors'
import { AlreadyRegistered } from './errors/AlreadyRegistered'
import { NoSuchLanguage } from './errors/NoSuchLanguage'
import {
  contestAnnouncementsMap,
  contestProblemsMap,
  contests,
} from './fixtures'
import { GradingVerdict } from './Grading'
import { Submission, SubmissionDetail } from './Submission'

export class InMemoryContestService implements ContestService {
  private authService: AuthService
  private contests: ContestDetail[] = []
  private contestProblemsMap: { [id: number]: number[] } = {}
  private contestAnnouncementsMap: { [id: number]: Announcement[] } = {}
  private contestClarificationsMap: { [id: number]: Clarification[] } = {}
  private contestSubmissionsMap: { [id: number]: SubmissionDetail[] } = {}

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
  ): Promise<Clarification> {
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
    return { ...clarification }
  }

  async createContestClarificationEntry(
    token: string,
    contestId: number,
    clarificationId: number,
    content: string
  ): Promise<Clarification> {
    const user = await this.authService.getMe(token)

    const contest = this.contests.filter(c => c.id === contestId).pop()
    if (!contest) {
      throw new NoSuchContest('No Such Contest')
    }
    if (!contest.registered) {
      throw new ForbiddenActionError('You Are Not Registered To The Contest')
    }
    if (new Date() >= contest.finishTime) {
      throw new ForbiddenActionError('Contest Already Finished')
    }

    const clarification = Object.values(
      this.contestClarificationsMap[contest.id]
    )
      .filter(c => c.id === clarificationId)
      .pop()

    if (!clarification) {
      throw new NoSuchClarification('No Such Clarification')
    }

    clarification.entries.push({
      id: Math.round(Math.random() * 100000),
      sender: user.username,
      issuedTime: new Date(),
      read: true,
      content,
    })
    return { ...clarification }
  }

  async readContestClarificationEntries(
    token: string,
    contestId: number,
    clarificationId: number,
    entryIds: number[]
  ): Promise<Clarification> {
    await this.authService.getMe(token)

    const contest = this.contests.filter(c => c.id === contestId).pop()
    if (!contest) {
      throw new NoSuchContest('No Such Contest')
    }
    if (!contest.registered) {
      throw new ForbiddenActionError('You Are Not Registered To The Contest')
    }
    if (new Date() >= contest.finishTime) {
      throw new ForbiddenActionError('Contest Already Finished')
    }

    const clarification = Object.values(
      this.contestClarificationsMap[contest.id]
    )
      .filter(c => c.id === clarificationId)
      .pop()

    if (!clarification) {
      throw new NoSuchClarification('No Such Clarification')
    }

    clarification.entries.forEach(entry => {
      if (entryIds.includes(entry.id)) {
        entry.read = true
      }
    })
    return clarification
  }

  async getContestSubmissions(
    token: string,
    contestId: number
  ): Promise<Submission[]> {
    await this.authService.getMe(token)
    const contest = this.contests.filter(c => c.id === contestId).pop()
    if (!contest) {
      throw new NoSuchContest('No Such Contest')
    }
    if (!contest.registered) {
      throw new ForbiddenActionError('You Are Not Registered To The Contest')
    }
    if (!this.contestSubmissionsMap[contestId]) {
      this.contestSubmissionsMap[contestId] = []
    }
    return this.contestSubmissionsMap[contestId].slice()
  }

  async subscribeContestSubmissions(
    token: string,
    contestId: number,
    callback: SubmissionSubscribeCallback
  ): Promise<SubmissionUnsubscribeFunction> {
    await this.authService.getMe(token)
    const contest = await this.getContestDetailById(contestId)
    if (!contest.registered) {
      throw new ForbiddenActionError('Cannot access contest submissions')
    }

    const runThis = async () => {
      if (!this.contestSubmissionsMap[contestId]) {
        this.contestSubmissionsMap[contestId] = []
      }
      const newSubmission: SubmissionDetail = {
        id: Math.round(Math.random() * 100000),
        issuer: [
          'jauhar',
          'arifin',
          'lorem',
          'ipsum',
          'dos',
          'color',
          'sit',
          'amet',
        ][Math.floor(Math.random() * 8)],
        contestId,
        problemId: this.contestProblemsMap[contestId][
          Math.floor(Math.random() * this.contestProblemsMap[contestId].length)
        ],
        languageId:
          contest.permittedLanguages[
            Math.floor(Math.random() * contest.permittedLanguages.length)
          ].id,
        issuedTime: new Date(),
        verdict: GradingVerdict.Pending,
        sourceCode:
          'https://raw.githubusercontent.com/jauhararifin/cp/master/atcoder_89_regular/c.cpp',
        gradings: [
          {
            id: Math.round(Math.random() * 100000),
            issuedTime: new Date(),
            verdict: GradingVerdict.InternalError,
            message: '',
            compilationOutput:
              'https://raw.githubusercontent.com/jauhararifin/cp/master/TODO',
          },
          {
            id: Math.round(Math.random() * 100000),
            issuedTime: new Date(),
            verdict: GradingVerdict.WrongAnswer,
            message: 'fixing compiler in worker',
            compilationOutput:
              'https://raw.githubusercontent.com/jauhararifin/cp/master/.gitignore',
          },
          {
            id: Math.round(Math.random() * 100000),
            issuedTime: new Date(),
            verdict: GradingVerdict.Accepted,
            message: 'fixing testcases',
            compilationOutput:
              'https://raw.githubusercontent.com/jauhararifin/cp/master/TODO',
          },
        ],
      }
      this.contestSubmissionsMap[contestId].push(newSubmission)

      const submissions = await this.getContestSubmissions(token, contestId)
      callback(submissions)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async submitContestSolution(
    token: string,
    contestId: number,
    problemId: number,
    languageId: number,
    sourceCode: string
  ): Promise<SubmissionDetail> {
    const me = await this.authService.getMe(token)
    const contest = this.contests.filter(c => c.id === contestId).pop()
    if (!contest) {
      throw new NoSuchContest('No Such Contest')
    }
    if (!contest.registered) {
      throw new ForbiddenActionError('You Are Not Registered To The Contest')
    }
    if (new Date() >= contest.finishTime) {
      throw new ForbiddenActionError('Contest Already Finished')
    }
    const language = contest.permittedLanguages
      .filter(lang => lang.id === languageId)
      .pop()
    if (!language) {
      throw new NoSuchLanguage('No Such Language')
    }
    const problems = this.contestProblemsMap[contestId].slice()
    if (!problems.includes(problemId)) {
      throw new NoSuchProblem('No Such Problem')
    }

    const submissionDetail: SubmissionDetail = {
      id: Math.round(Math.random() * 100000),
      issuer: me.username,
      contestId,
      problemId,
      languageId,
      issuedTime: new Date(),
      verdict: GradingVerdict.Pending,
      sourceCode,
      gradings: [
        {
          id: Math.round(Math.random() * 100000),
          issuedTime: new Date(),
          verdict: GradingVerdict.Accepted,
          message: '',
          compilationOutput: 'some compilation output here',
        },
        {
          id: Math.round(Math.random() * 100000),
          issuedTime: new Date(Date.now()),
          verdict: GradingVerdict.Pending,
          message: '',
          compilationOutput: '',
        },
      ],
    }

    if (!this.contestSubmissionsMap[contestId]) {
      this.contestSubmissionsMap[contestId] = []
    }
    this.contestSubmissionsMap[contestId].push(submissionDetail)
    return { ...submissionDetail }
  }
}
