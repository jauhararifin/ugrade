import { AuthService, UserPermission } from 'ugrade/services/auth'
import { NoSuchProblem } from '../errors'
import { Problem } from '../Problem'
import { ProblemService } from '../ProblemService'
import { problems as fixture } from './fixtures'

export class InMemoryProblemService implements ProblemService {
  private authService: AuthService
  private problems: Problem[] = []

  constructor(authService: AuthService, problems: Problem[] = fixture) {
    this.problems = problems
    this.authService = authService
  }

  async getProblemById(token: string, id: string): Promise<Problem> {
    const user = await this.authService.getMe(token)
    if (id.length === 0) throw new Error('Connection Error')

    const problem = this.problems
      .filter(x => x.id === id)
      .slice()
      .pop()
    if (problem) {
      if (
        problem.disabled &&
        !user.permissions.includes(UserPermission.ProblemsReadDisabled)
      ) {
        throw new NoSuchProblem('No Such Problem')
      }
      return problem
    }
    throw new NoSuchProblem('No Such Problem')
  }

  async getProblemByIds(token: string, ids: string[]): Promise<Problem[]> {
    const user = await this.authService.getMe(token)
    const canReadDisabled = user.permissions.includes(
      UserPermission.ProblemsReadDisabled
    )
    if (ids.length === 0) throw new Error('Connection Error')

    return this.problems
      .filter(x => ids.includes(x.id))
      .filter(x => canReadDisabled || !x.disabled)
      .slice()
  }
}
