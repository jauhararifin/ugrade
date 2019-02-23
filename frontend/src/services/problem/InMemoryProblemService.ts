import { NoSuchProblem } from './errors'
import { problems as fixture } from './fixtures'
import { Problem } from './Problem'
import { ProblemService } from './ProblemService'

export class InMemoryProblemService implements ProblemService {
  private problems: Problem[] = []

  constructor(problems: Problem[] = fixture) {
    this.problems = problems
  }

  async getProblemById(id: string): Promise<Problem> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (id.length === 0) throw new Error('Connection Error')

    const problem = this.problems
      .filter(x => x.id === id)
      .slice()
      .pop()
    if (problem) return problem
    throw new NoSuchProblem('No Such Problem')
  }

  async getProblemByIds(ids: string[]): Promise<Problem[]> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    if (ids.length === 0) throw new Error('Connection Error')

    return this.problems.filter(x => ids.includes(x.id)).slice()
  }
}
