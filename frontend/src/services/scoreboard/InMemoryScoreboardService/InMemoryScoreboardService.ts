import lodash from 'lodash'
import { AuthService } from 'ugrade/services/auth/AuthService'
import { InMemoryProblemService } from 'ugrade/services/problem/InMemoryProblemService'
import { simplePublisher } from 'ugrade/utils'
import { ProblemScore, Scoreboard } from '../Scoreboard'
import {
  ScoreboardCallback,
  ScoreboardService,
  ScoreboardUnsubscribe,
} from '../ScoreboardService'

export class InMemoryScoreboardService implements ScoreboardService {
  private authService: AuthService
  private problemService: InMemoryProblemService
  private scoreboardMap: { [contestId: string]: Scoreboard }

  constructor(
    authService: AuthService,
    problemService: InMemoryProblemService
  ) {
    this.authService = authService
    this.problemService = problemService
    this.scoreboardMap = {}
    this.handleSubscription()
  }

  async getScoreboard(token: string): Promise<Scoreboard> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    if (!this.scoreboardMap[contestId]) {
      this.scoreboardMap[contestId] = await this.createEmptyScoreboard(
        contestId
      )
    }
    return lodash.cloneDeep(this.scoreboardMap[contestId])
  }

  subscribeScoreboard(
    token: string,
    callback: ScoreboardCallback
  ): ScoreboardUnsubscribe {
    return simplePublisher(this.getScoreboard.bind(this, token), callback)
  }

  private async createEmptyScoreboard(contestId: string): Promise<Scoreboard> {
    const genDefaultProbScore = () => {
      const result: { [id: string]: ProblemScore } = {}
      const problemIds = Object.keys(this.problemService.problemsMap[contestId])
      for (const problemId of problemIds) {
        result[problemId] = {
          problemId,
          attempt: 0,
          penalty: 0,
          passed: false,
          freezed: false,
          first: false,
        }
      }
      return result
    }

    const users = await this.authService.getUsers(contestId)

    return {
      contestId,
      lastUpdated: new Date(),
      freezed: false,
      entries: users
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

  private handleSubscription() {
    setInterval(() => {
      for (const contestId of Object.keys(this.scoreboardMap)) {
        const problemIds = Object.keys(
          this.problemService.problemsMap[contestId]
        )
        const scoreboard = this.scoreboardMap[contestId]
        scoreboard.lastUpdated = new Date()
        const entr = Math.floor(Math.random() * scoreboard.entries.length)
        const prob = problemIds[Math.floor(Math.random() * problemIds.length)]
        const probScore = scoreboard.entries[entr].problemScores[prob]
        probScore.attempt++
        probScore.first = Math.random() > 0.5
        probScore.freezed = Math.random() > 0.5
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
}
