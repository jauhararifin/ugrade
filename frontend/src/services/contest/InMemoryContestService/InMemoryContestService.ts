import lodash from 'lodash'
import loremIpsum from 'lorem-ipsum'
import { globalErrorCatcher } from 'ugrade/common'
import { User } from 'ugrade/services/auth'
import { InMemoryAuthService } from 'ugrade/services/auth/InMemoryAuthService'
import { InMemoryProblemService } from 'ugrade/services/problem/InMemoryProblemService'
import { ServerStatusService } from 'ugrade/services/serverStatus'
import { simplePublisher } from 'ugrade/utils'
import { Contest, Language } from '../Contest'
import {
  ContestService,
  SubscriptionCallback,
  UnsubscriptionFunction,
} from '../ContestService'
import { ContestIdTaken, NoSuchContest } from '../errors'
import { NoSuchLanguage } from '../errors/NoSuchLanguage'
import { GradingVerdict } from '../Grading'
import { Scoreboard, ScoreboardProblemScore } from '../Scoreboard'
import { contests, languages } from './fixtures'

export class InMemoryContestService implements ContestService {
  private authService: InMemoryAuthService
  private problemService: InMemoryProblemService
  private serverStatusService: ServerStatusService

  private contests: Contest[] = []

  private contestScoreboardMap: { [id: string]: Scoreboard } = {}

  private languages: { [id: string]: Language } = {}

  constructor(
    serverStatusService: ServerStatusService,
    authService: InMemoryAuthService,
    problemService: InMemoryProblemService
  ) {
    this.serverStatusService = serverStatusService
    this.authService = authService
    this.problemService = problemService

    this.contests = contests.slice()

    for (const contest of this.contests) {
      const genDefaultProbScore = () => {
        const result: { [id: string]: ScoreboardProblemScore } = {}
        const problemIds = Object.keys(
          this.problemService.problemsMap[contest.id]
        )
        for (const problemId of problemIds) {
          result[problemId] = {
            problemId,
            attempt: 0,
            penalty: 0,
            passed: false,
            frozen: false,
            first: false,
          }
        }
        return result
      }
      this.contestScoreboardMap[contest.id] = {
        contestId: contest.id,
        lastUpdated: new Date(),
        entries: lodash
          .values(this.authService.contestUserMap[contest.id])
          .filter(user => user.username !== '')
          .map(user => user.username)
          .map(uname => ({
            rank: 1,
            contestant: uname,
            totalPassed: 0,
            totalPenalty: 0,
            problemScores: genDefaultProbScore(),
          })),
      }
    }

    this.languages = languages

    this.handleSubs().catch(globalErrorCatcher)
  }

  async handleSubs() {
    setInterval(() => {
      for (const contest of this.contests) {
        // update scoreboard
        const problemIds = Object.keys(
          this.problemService.problemsMap[contest.id]
        )
        const scoreboard = this.contestScoreboardMap[contest.id]
        scoreboard.lastUpdated = new Date()
        const entr = Math.floor(Math.random() * scoreboard.entries.length)
        const prob = problemIds[Math.floor(Math.random() * problemIds.length)]
        const probScore = scoreboard.entries[entr].problemScores[prob]
        probScore.attempt++
        probScore.first = Math.random() > 0.5
        probScore.frozen = Math.random() > 0.5
        probScore.passed = Math.random() > 0.5
        probScore.penalty += Math.round(Math.random() * 120)
        const probS = lodash.values(scoreboard.entries[entr].problemScores)
        scoreboard.entries[entr].totalPassed = probS.filter(
          p => p.passed
        ).length
        scoreboard.entries[entr].totalPenalty = lodash.sum(
          probS.map(s => s.penalty)
        )
        scoreboard.entries.sort((a, b) => {
          if (a.totalPassed === b.totalPassed) {
            return a.totalPenalty - b.totalPenalty
          }
          return b.totalPassed - a.totalPassed
        })
        let lastRank = 0
        let lastPassed = -1
        let lastPenalty = -1
        for (const en of scoreboard.entries) {
          if (
            en.totalPassed !== lastPassed ||
            en.totalPenalty !== lastPenalty
          ) {
            lastRank++
          }
          en.rank = lastRank
          lastPassed = en.totalPassed
          lastPenalty = en.totalPenalty
        }
      }
    }, 60 * 1000)
  }

  async getAvailableLanguages(): Promise<Language[]> {
    return lodash.values(this.languages).slice()
  }

  async getContestByShortId(shortId: string): Promise<Contest> {
    await this.serverStatusService.ping()
    const contest = this.contests
      .slice()
      .filter(x => x.shortId === shortId)
      .pop()
    if (!contest) throw new NoSuchContest('No Such Contest')
    return lodash.cloneDeep(contest)
  }

  async getMyContest(token: string): Promise<Contest> {
    const user = await this.authService.getMe(token)
    const contest = this.contests
      .slice()
      .filter(x => x.id === user.contestId)
      .pop()
    if (contest) return lodash.cloneDeep(contest)
    throw new NoSuchContest('No Such Contest')
  }

  async updateContestInfo(
    token: string,
    name?: string,
    shortDescription?: string,
    description?: string,
    startTime?: Date,
    freezed?: boolean,
    finishTime?: Date,
    permittedLanguages?: Language[]
  ): Promise<Contest> {
    const contest = await this.getMyContest(token)
    if (name) contest.name = name
    if (shortDescription) contest.shortDescription = shortDescription
    if (description) contest.description = description
    if (startTime) contest.startTime = startTime
    if (freezed !== undefined) contest.freezed = freezed
    if (finishTime) contest.finishTime = finishTime
    if (permittedLanguages) contest.permittedLanguages = permittedLanguages

    for (const i in this.contests) {
      if (this.contests[i].id === contest.id) {
        this.contests[i] = lodash.cloneDeep(contest)
      }
    }
    return lodash.cloneDeep(contest)
  }

  subscribeMyContest(
    token: string,
    callback: SubscriptionCallback<Contest>
  ): UnsubscriptionFunction {
    return simplePublisher(this.getMyContest.bind(this, token), callback)
  }

  async getScoreboard(token: string): Promise<Scoreboard> {
    const contest = await this.getMyContest(token)
    return lodash.cloneDeep(this.contestScoreboardMap[contest.id])
  }

  subscribeScoreboard(
    token: string,
    callback: SubscriptionCallback<Scoreboard>
  ): UnsubscriptionFunction {
    return simplePublisher(this.getScoreboard.bind(this, token), callback)
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
    return lodash.cloneDeep<[Contest, User]>([newContest, user])
  }
}
