import { ForbiddenActionError, User } from 'ugrade/services/auth'
import { InMemoryAuthService } from 'ugrade/services/auth/InMemoryAuthService'
import { NoSuchProblem } from 'ugrade/services/problem'
import { ServerStatusService } from 'ugrade/services/serverStatus'
import { Announcement } from '../Announcement'
import { Clarification, ClarificationEntry } from '../Clarification'
import { Contest, Language } from '../Contest'
import {
  ContestService,
  SubscriptionCallback,
  UnsubscriptionFunction,
} from '../ContestService'
import { ContestIdTaken, NoSuchClarification, NoSuchContest } from '../errors'
import { NoSuchLanguage } from '../errors/NoSuchLanguage'
import { GradingVerdict } from '../Grading'
import { Scoreboard } from '../Scoreboard'
import { Submission } from '../Submission'
import {
  contestAnnouncementsMap,
  contestProblemsMap,
  contests,
  languages,
} from './fixtures'

export class InMemoryContestService implements ContestService {
  private authService: InMemoryAuthService
  private serverStatusService: ServerStatusService

  private contests: Contest[] = []
  private contestProblemsMap: { [id: string]: string[] } = {}
  private contestAnnouncementsMap: { [id: string]: Announcement[] } = {}
  private contestClarificationsMap: { [id: string]: Clarification[] } = {}
  private contestSubmissionsMap: { [id: string]: Submission[] } = {}

  private languages: { [id: string]: Language } = {}

  constructor(
    serverStatusService: ServerStatusService,
    authService: InMemoryAuthService
  ) {
    this.serverStatusService = serverStatusService
    this.authService = authService

    this.contests = contests.slice()
    this.contestProblemsMap = { ...contestProblemsMap }
    this.contestAnnouncementsMap = { ...contestAnnouncementsMap }

    this.contests.forEach(
      contest =>
        (this.contestClarificationsMap[contest.id] = [
          {
            id: Math.round(Math.random() * 100000).toString(),
            title: 'Lorem Ipsum',
            subject: 'General Issue',
            issuedTime: new Date(),
            entries: [
              {
                id: Math.round(Math.random() * 100000).toString(),
                sender: 'test',
                read: true,
                issuedTime: new Date(),
                content: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
              },
            ],
          },
        ])
    )

    this.languages = languages
  }

  async getAvailableLanguages(): Promise<Language[]> {
    return Object.values(this.languages).slice()
  }

  async getContestByShortId(shortId: string): Promise<Contest> {
    await this.serverStatusService.ping()
    const contest = this.contests
      .slice()
      .filter(x => x.shortId === shortId)
      .pop()
    if (!contest) throw new NoSuchContest('No Such Contest')
    return contest
  }

  async getMyContest(token: string): Promise<Contest> {
    const user = await this.authService.getMe(token)
    const contest = contests
      .slice()
      .filter(x => x.id === user.contestId)
      .pop()
    if (contest) return contest
    throw new NoSuchContest('No Such Contest')
  }

  async getAnnouncements(token: string): Promise<Announcement[]> {
    const contest = await this.getMyContest(token)
    return this.contestAnnouncementsMap[contest.id].slice()
  }

  subscribeAnnouncements(
    token: string,
    callback: SubscriptionCallback<Announcement[]>
  ): UnsubscriptionFunction {
    const runThis = async () => {
      const newAnnouncement: Announcement = {
        id: Math.round(Math.random() * 300).toString(),
        title: `Lorem Ipsum ${Math.random()}`,
        content: `Lorem ipsum dos color sit amet`,
        issuedTime: new Date(Date.now()),
        read: false,
      }

      const contest = await this.getMyContest(token)
      const arr = await this.getAnnouncements(token)
      arr.push(newAnnouncement)
      this.contestAnnouncementsMap[contest.id] = arr

      const announcements = await this.getAnnouncements(token)
      callback(announcements)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async readAnnouncements(token: string, id: string[]): Promise<void> {
    const contest = await this.getMyContest(token)
    this.contestAnnouncementsMap[contest.id]
      .filter(i => id.includes(i.id))
      .forEach(val => (val.read = true))
  }

  async getProblemIds(token: string): Promise<string[]> {
    const contest = await this.getMyContest(token)
    return this.contestProblemsMap[contest.id].slice()
  }

  subscribeProblemIds(
    token: string,
    callback: SubscriptionCallback<string[]>
  ): UnsubscriptionFunction {
    const runThis = async () => {
      const contest = await this.getMyContest(token)
      const arr = await this.getProblemIds(token)
      if (arr.length > 0) {
        const first = arr.shift() as string
        arr.push(first)
      }
      this.contestProblemsMap[contest.id] = arr

      const problemIds = await this.getProblemIds(token)
      callback(problemIds)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async getClarifications(token: string): Promise<Clarification[]> {
    const contest = await this.getMyContest(token)
    return this.contestClarificationsMap[contest.id].slice()
  }

  async subscribeClarifications(
    token: string,
    callback: SubscriptionCallback<Clarification[]>
  ): Promise<UnsubscriptionFunction> {
    const runThis = async () => {
      const arr = await this.getClarifications(token)
      for (const clarif of arr) {
        const newEntry: ClarificationEntry = {
          id: Math.round(Math.random() * 100000).toString(),
          sender: 'jury',
          content: `Some random content ${Math.random()}`,
          read: false,
          issuedTime: new Date(),
        }
        clarif.entries.push(newEntry)
      }

      const clarifications = await this.getClarifications(token)
      callback(clarifications)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async createClarification(
    token: string,
    title: string,
    subject: string,
    content: string
  ): Promise<Clarification> {
    const user = await this.authService.getMe(token)
    const contest = await this.getMyContest(token)
    const clarification: Clarification = {
      id: Math.round(Math.random() * 100000).toString(),
      title,
      subject,
      issuedTime: new Date(),
      entries: [
        {
          id: Math.round(Math.random() * 100000).toString(),
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

  async createClarificationEntry(
    token: string,
    clarificationId: string,
    content: string
  ): Promise<Clarification> {
    const user = await this.authService.getMe(token)
    const contest = await this.getMyContest(token)

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
      id: Math.round(Math.random() * 100000).toString(),
      sender: user.username,
      issuedTime: new Date(),
      read: true,
      content,
    })
    return { ...clarification }
  }

  async readClarificationEntries(
    token: string,
    clarificationId: string,
    entryIds: string[]
  ): Promise<Clarification> {
    await this.authService.getMe(token)
    const contest = await this.getMyContest(token)

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

  async getSubmissions(token: string): Promise<Submission[]> {
    const contest = await this.getMyContest(token)
    if (!this.contestSubmissionsMap[contest.id]) {
      this.contestSubmissionsMap[contest.id] = []
    }
    return this.contestSubmissionsMap[contest.id].slice()
  }

  async subscribeSubmissions(
    token: string,
    callback: SubscriptionCallback<Submission[]>
  ): Promise<UnsubscriptionFunction> {
    const contest = await this.getMyContest(token)

    const runThis = async () => {
      if (!this.contestSubmissionsMap[contest.id]) {
        this.contestSubmissionsMap[contest.id] = []
      }
      const newSubmission: Submission = {
        id: Math.round(Math.random() * 100000).toString(),
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
        contestId: contest.id,
        problemId: this.contestProblemsMap[contest.id][
          Math.floor(Math.random() * this.contestProblemsMap[contest.id].length)
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
            id: Math.round(Math.random() * 100000).toString(),
            issuedTime: new Date(),
            verdict: GradingVerdict.InternalError,
            message: '',
            compilationOutput:
              'https://raw.githubusercontent.com/jauhararifin/cp/master/TODO',
          },
          {
            id: Math.round(Math.random() * 100000).toString(),
            issuedTime: new Date(),
            verdict: GradingVerdict.WrongAnswer,
            message: 'fixing compiler in worker',
            compilationOutput:
              'https://raw.githubusercontent.com/jauhararifin/cp/master/.gitignore',
          },
          {
            id: Math.round(Math.random() * 100000).toString(),
            issuedTime: new Date(),
            verdict: GradingVerdict.Accepted,
            message: 'fixing testcases',
            compilationOutput:
              'https://raw.githubusercontent.com/jauhararifin/cp/master/TODO',
          },
        ],
      }
      this.contestSubmissionsMap[contest.id].push(newSubmission)

      const submissions = await this.getSubmissions(token)
      callback(submissions)
    }

    const timeout = setInterval(runThis, (10 + Math.random() * 5) * 1000)
    return () => {
      clearInterval(timeout)
    }
  }

  async submitSolution(
    token: string,
    problemId: string,
    languageId: string,
    sourceCode: string
  ): Promise<Submission> {
    const me = await this.authService.getMe(token)
    const contest = await this.getMyContest(token)
    if (new Date() >= contest.finishTime) {
      throw new ForbiddenActionError('Contest Already Finished')
    }
    const language = contest.permittedLanguages
      .filter(lang => lang.id === languageId)
      .pop()
    if (!language) {
      throw new NoSuchLanguage('No Such Language')
    }
    const problems = this.contestProblemsMap[contest.id].slice()
    if (!problems.includes(problemId)) {
      throw new NoSuchProblem('No Such Problem')
    }

    const submissionDetail: Submission = {
      id: Math.round(Math.random() * 100000).toString(),
      issuer: me.username,
      contestId: contest.id,
      problemId,
      languageId,
      issuedTime: new Date(),
      verdict: GradingVerdict.Pending,
      sourceCode,
      gradings: [
        {
          id: Math.round(Math.random() * 100000).toString(),
          issuedTime: new Date(),
          verdict: GradingVerdict.Accepted,
          message: '',
          compilationOutput: 'some compilation output here',
        },
        {
          id: Math.round(Math.random() * 100000).toString(),
          issuedTime: new Date(Date.now()),
          verdict: GradingVerdict.Pending,
          message: '',
          compilationOutput: '',
        },
      ],
    }

    if (!this.contestSubmissionsMap[contest.id]) {
      this.contestSubmissionsMap[contest.id] = []
    }
    this.contestSubmissionsMap[contest.id].push(submissionDetail)
    return { ...submissionDetail }
  }

  async getScoreboard(token: string): Promise<Scoreboard> {
    const contest = await this.getMyContest(token)
    return {
      contestId: contest.id,
      lastUpdated: new Date(),
      entries: [],
    }
  }

  async createContest(
    email: string,
    shortId: string,
    name: string,
    shortDescription: string,
    description: string,
    startTime: Date,
    finishTime: Date,
    permittedLanguages?: string[]
  ): Promise<[Contest, User]> {
    if (!permittedLanguages) permittedLanguages = Object.keys(this.languages)
    if (permittedLanguages.filter(id => !this.languages[id]).pop()) {
      throw new NoSuchLanguage('No Such Language')
    }
    if (this.contests.filter(c => c.shortId === shortId).pop()) {
      throw new ContestIdTaken('Contest ID Already Taken')
    }
    const langs = permittedLanguages.map(id => this.languages[id])

    const newContest: Contest = {
      id: Math.round(Math.random() * 100000).toString(),
      shortId,
      name,
      shortDescription,
      description,
      startTime,
      finishTime,
      freezed: false,
      permittedLanguages: langs,
    }
    this.contests.push(newContest)
    const user = await this.authService.registerContestAdmin(
      newContest.id,
      email
    )
    return [newContest, user]
  }
}
