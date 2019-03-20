import lodash from 'lodash'
import { AuthService, ForbiddenAction, Permission } from 'ugrade/auth'
import { ContestService } from 'ugrade/contest'
import { genUUID } from 'ugrade/uuid'
import { AlreadyUsedId } from '../AlreadUsedId'
import { NoSuchProblem } from '../NoSuchProblem'
import { Problem, ProblemType } from '../problem'
import { ProblemService } from '../service'
import { problemServiceValidator } from '../validations'

export class InMemoryProblemService implements ProblemService {
  private authService: AuthService
  private contestService: ContestService
  private problems: Problem[]
  private idProblem: { [id: string]: Problem }
  private contestProblem: { [contestId: string]: Problem[] }
  private contestShortId: { [key: string]: boolean }

  constructor(authService: AuthService, contestService: ContestService, problems: Problem[] = []) {
    this.authService = authService
    this.contestService = contestService
    this.problems = lodash.cloneDeep(problems)
    this.idProblem = {}
    this.contestProblem = {}
    this.contestShortId = {}
    for (const problem of this.problems) {
      this.idProblem[problem.id] = problem
      if (!this.contestProblem[problem.contestId]) {
        this.contestProblem[problem.contestId] = []
      }
      this.contestProblem[problem.contestId].push(problem)
      this.contestShortId[`${problem.contestId}:${problem.shortId}`] = true
    }
  }

  async getContestProblems(token: string, contestId: string): Promise<Problem[]> {
    await problemServiceValidator.getContestProblems(token, contestId)

    // check read permission
    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.ProblemsRead)) {
      throw new ForbiddenAction()
    }

    // check contest exists
    await this.contestService.getContestById(contestId)

    // check contest ownership
    if (me.contestId !== contestId) throw new ForbiddenAction()

    if (!this.contestProblem[contestId]) this.contestProblem[contestId] = []
    let result = this.contestProblem[contestId]

    // filter disabled problem
    if (!me.permissions.includes(Permission.ProblemsReadDisabled)) {
      result = result.filter(prob => !prob.disabled)
    }

    return lodash.cloneDeep(result)
  }

  async getContestProblemById(token: string, contestId: string, problemId: string): Promise<Problem> {
    await problemServiceValidator.getContestProblemById(token, contestId, problemId)

    // check read permission
    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.ProblemsRead)) {
      throw new ForbiddenAction()
    }

    // check contest exists
    await this.contestService.getContestById(contestId)

    // check contest ownership
    if (me.contestId !== contestId) throw new ForbiddenAction()

    // check problem exists
    if (!this.idProblem[problemId]) throw new NoSuchProblem()
    const problem = this.idProblem[problemId]
    if (problem.contestId !== me.contestId) throw new NoSuchProblem()
    if (!me.permissions.includes(Permission.ProblemsReadDisabled) && problem.disabled) {
      throw new NoSuchProblem()
    }

    return lodash.cloneDeep(problem)
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
    await problemServiceValidator.createProblem(
      token,
      shortId,
      name,
      statement,
      type,
      disabled,
      timeLimit,
      tolerance,
      memoryLimit,
      outputLimit
    )

    // check create permission
    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.ProblemsCreate)) {
      throw new ForbiddenAction()
    }

    // check used short id
    if (this.contestShortId[`${me.contestId}:${shortId}`]) {
      throw new AlreadyUsedId()
    }

    // create new problem
    if (!this.contestProblem[me.contestId]) {
      this.contestProblem[me.contestId] = []
    }
    const newProblem: Problem = {
      id: genUUID(),
      shortId,
      contestId: me.contestId,
      issuerId: me.id,
      order: this.contestProblem[me.contestId].length,
      issuedTime: new Date(),
      name,
      statement,
      type,
      disabled,
      timeLimit,
      tolerance,
      memoryLimit,
      outputLimit,
    }

    // insert to store
    this.problems.push(newProblem)
    this.idProblem[newProblem.id] = newProblem
    this.contestProblem[newProblem.contestId].push(newProblem)
    this.contestShortId[`${me.contestId}:${shortId}`] = true

    return lodash.cloneDeep(newProblem)
  }

  async updateProblem(
    token: string,
    problemId: string,
    name: string,
    statement: string,
    type: ProblemType,
    disabled: boolean,
    order: number,
    timeLimit: number,
    tolerance: number,
    memoryLimit: number,
    outputLimit: number
  ): Promise<Problem> {
    await problemServiceValidator.updateProblem(
      token,
      problemId,
      name,
      statement,
      type,
      disabled,
      order,
      timeLimit,
      tolerance,
      memoryLimit,
      outputLimit
    )

    // check update permission
    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.ProblemsUpdate)) {
      throw new ForbiddenAction()
    }

    // get the problem and check permission
    const problem = await this.getContestProblemById(token, me.contestId, problemId)

    // generate new problem
    const newProblem: Problem = {
      id: genUUID(),
      shortId: problem.shortId,
      contestId: problem.contestId,
      issuerId: problem.issuerId,
      issuedTime: problem.issuedTime,
      order,
      name,
      statement,
      type,
      disabled,
      timeLimit,
      tolerance,
      memoryLimit,
      outputLimit,
    }

    // update storage
    for (let i = 0; i < this.problems.length; i++) {
      if (this.problems[i].id === problemId) {
        this.problems[i] = newProblem
        break
      }
    }
    this.idProblem[newProblem.id] = newProblem
    if (!this.contestProblem[newProblem.contestId]) {
      this.contestProblem[newProblem.contestId] = []
    }
    for (let i = 0; i < this.contestProblem[newProblem.contestId].length; i++) {
      if (this.contestProblem[newProblem.contestId][i].id === newProblem.id) {
        this.contestProblem[newProblem.contestId][i] = newProblem
      }
    }
    this.contestShortId[`${newProblem.contestId}:${newProblem.shortId}`] = true

    return lodash.cloneDeep(newProblem)
  }

  async deleteProblem(token: string, problemId: string): Promise<Problem> {
    await problemServiceValidator.deleteProblem(token, problemId)

    // check update permission
    const me = await this.authService.getMe(token)
    if (!me.permissions.includes(Permission.ProblemsDelete)) {
      throw new ForbiddenAction()
    }

    // get the problem and check permission
    const problem = await this.getContestProblemById(token, me.contestId, problemId)

    // update storage
    this.problems = lodash.remove(this.problems, p => p.id === problemId)
    delete this.idProblem[problem.id]
    if (this.contestProblem[problem.contestId]) {
      this.contestProblem[problem.contestId] = lodash.remove(
        this.contestProblem[problem.contestId],
        p => p.id === problemId
      )
    }
    this.contestShortId[`${problem.contestId}:${problem.shortId}`] = false

    throw new Error('not yet implemented')
  }
}
