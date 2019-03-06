import lodash from 'lodash'
import { AuthService, UserPermission } from 'ugrade/services/auth'
import { simplePublisher } from 'ugrade/utils'
import { NoSuchProblemError } from '../errors'
import { Problem } from '../Problem'
import {
  ProblemsCallback,
  ProblemService,
  ProblemsUnsubscribe,
} from '../ProblemService'
import { problemsMap } from './fixtures'

export class InMemoryProblemService implements ProblemService {
  public problemsMap: { [contestId: string]: Problem[] }
  private authService: AuthService

  constructor(authService: AuthService) {
    this.problemsMap = problemsMap
    this.authService = authService
    this.handleSubscription()
  }

  async getProblemById(token: string, problemId: string): Promise<Problem> {
    const user = await this.authService.getMe(token)
    const contestId = user.contestId
    const canReadDisabled = user.permissions.includes(
      UserPermission.ProblemsReadDisabled
    )
    const problem = this.problemsMap[contestId]
      .filter(prob => {
        return canReadDisabled || !prob.disabled
      })
      .filter(prob => prob.id === problemId)
      .pop()
    if (!problem) throw new NoSuchProblemError('No Such Problem')
    return problem
  }

  async getProblems(token: string): Promise<Problem[]> {
    const user = await this.authService.getMe(token)
    const contestId = user.contestId
    const canReadDisabled = user.permissions.includes(
      UserPermission.ProblemsReadDisabled
    )

    if (!this.problemsMap[contestId]) {
      this.problemsMap[contestId] = []
    }
    return lodash.cloneDeep(
      this.problemsMap[contestId].filter(prob => {
        return canReadDisabled || !prob.disabled
      })
    )
  }

  subscribeProblems(
    token: string,
    callback: ProblemsCallback
  ): ProblemsUnsubscribe {
    return simplePublisher(this.getProblems.bind(this, token), callback)
  }

  async deleteProblems(token: string, problemIds: string[]): Promise<string[]> {
    const me = await this.authService.getMe(token)
    const contestId = me.contestId
    if (!this.problemsMap[contestId]) this.problemsMap[contestId] = []
    const deleted = []
    const remaining = []
    for (const prob of this.problemsMap[contestId]) {
      if (problemIds.includes(prob.id)) deleted.push(prob.id)
      else remaining.push(prob)
    }
    this.problemsMap[contestId] = remaining
    return deleted
  }

  private handleSubscription() {
    setInterval(() => {
      for (const contestId of Object.keys(this.problemsMap)) {
        if (!this.problemsMap[contestId]) {
          this.problemsMap[contestId] = []
        }
        const problemArr = this.problemsMap[contestId]
        if (problemArr.length > 0) {
          const temp = problemArr.shift()
          if (temp) problemArr.push(temp)
        }
      }
    }, 60 * 1000)
  }
}
