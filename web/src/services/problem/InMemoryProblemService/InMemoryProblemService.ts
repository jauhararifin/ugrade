import lodash from 'lodash'
import { AuthService, ForbiddenActionError, UserPermission } from 'ugrade/services/auth'
import { simplePublisher } from 'ugrade/utils'
import { NoSuchProblemError, ProblemIdAlreadyTaken } from '../errors'
import { Problem, ProblemType } from '../Problem'
import { ProblemsCallback, ProblemService, ProblemsUnsubscribe } from '../ProblemService'
import { problemsMap } from './fixtures'

export class InMemoryProblemService implements ProblemService {
  public problemsMap: { [contestId: string]: Problem[] }
  private authService: AuthService

  constructor(authService: AuthService) {
    this.problemsMap = problemsMap
    this.authService = authService
    this.handleSubscription()
  }

  async createProblem(
    token: string,
    shortId: string,
    name: string,
    statement: string,
    type: ProblemType,
    disabled: boolean,
    timeLimit: number,
    tolerance: number,
    memoryLimit: number,
    outputLimit: number
  ): Promise<Problem> {
    const user = await this.authService.getMe(token)
    if (!user.permissions.includes(UserPermission.ProblemsCreate)) {
      throw new ForbiddenActionError(`User Doesn't Have Create Problem Permission`)
    }

    const contestId = user.contestId

    if (!this.problemsMap[contestId]) this.problemsMap[contestId] = []
    const problems = this.problemsMap[contestId]
    if (problems.filter(p => p.shortId === shortId).pop()) {
      throw new ProblemIdAlreadyTaken('Problem Id Already Taken')
    }

    const newProblem: Problem = {
      id: Math.round(Math.random() * 100000).toString(),
      shortId,
      name,
      statement,
      type,
      disabled,
      timeLimit,
      tolerance,
      memoryLimit,
      outputLimit,
      order: problems.length,
    }
    this.problemsMap[contestId].push(newProblem)

    return lodash.cloneDeep(newProblem)
  }

  async getProblemById(token: string, problemId: string): Promise<Problem> {
    const user = await this.authService.getMe(token)
    const contestId = user.contestId
    const canReadDisabled = user.permissions.includes(UserPermission.ProblemsReadDisabled)
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
    const canReadDisabled = user.permissions.includes(UserPermission.ProblemsReadDisabled)

    if (!this.problemsMap[contestId]) {
      this.problemsMap[contestId] = []
    }
    return lodash.cloneDeep(
      this.problemsMap[contestId].filter(prob => {
        return canReadDisabled || !prob.disabled
      })
    )
  }

  subscribeProblems(token: string, callback: ProblemsCallback): ProblemsUnsubscribe {
    return simplePublisher(this.getProblems.bind(this, token), callback)
  }

  async updateProblem(
    token: string,
    problemId: string,
    shortId?: string,
    name?: string,
    statement?: string,
    type?: ProblemType,
    disabled?: boolean,
    timeLimit?: number,
    tolerance?: number,
    memoryLimit?: number,
    outputLimit?: number
  ): Promise<Problem> {
    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(UserPermission.ProblemsUpdate)) {
      throw new ForbiddenActionError(`User doesn't have permission to update problem`)
    }

    const contestId = me.contestId
    if (!this.problemsMap[contestId]) this.problemsMap[contestId] = []

    const problems = this.problemsMap[contestId]
    const usedSIds = problems.filter(p => p.id !== problemId).map(p => p.shortId)
    for (const problem of problems) {
      if (problem.id === problemId) {
        if (shortId) {
          if (usedSIds.includes(shortId)) {
            throw new ProblemIdAlreadyTaken('Problem Id Already Taken')
          }
          problem.shortId = shortId
        }

        if (name) problem.name = name
        if (statement) problem.statement = statement
        if (type) problem.type = type
        if (disabled !== undefined) problem.disabled = disabled
        if (timeLimit) problem.timeLimit = timeLimit
        if (tolerance) problem.tolerance = tolerance
        if (memoryLimit) problem.memoryLimit = memoryLimit
        if (outputLimit) problem.outputLimit = outputLimit

        return lodash.cloneDeep(problem)
      }
    }
    throw new NoSuchProblemError('No Such Problem')
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
