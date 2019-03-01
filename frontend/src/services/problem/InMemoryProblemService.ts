import { ServerStatusService } from 'ugrade/services/serverStatus'
import { NoSuchProblem } from './errors'
import { problems as fixture } from './fixtures'
import { Problem } from './Problem'
import { ProblemService } from './ProblemService'

export class InMemoryProblemService implements ProblemService {
  private serverStatusService: ServerStatusService
  private problems: Problem[] = []

  constructor(
    serverStatusService: ServerStatusService,
    problems: Problem[] = fixture
  ) {
    this.problems = problems
    this.serverStatusService = serverStatusService
  }

  async getProblemById(_token: string, id: string): Promise<Problem> {
    await this.serverStatusService.ping()
    if (id.length === 0) throw new Error('Connection Error')

    const problem = this.problems
      .filter(x => x.id === id)
      .slice()
      .pop()
    if (problem) return problem
    throw new NoSuchProblem('No Such Problem')
  }

  async getProblemByIds(_token: string, ids: string[]): Promise<Problem[]> {
    await this.serverStatusService.ping()
    if (ids.length === 0) throw new Error('Connection Error')

    return this.problems.filter(x => ids.includes(x.id)).slice()
  }
}
