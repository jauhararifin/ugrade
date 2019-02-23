import { Problem } from './Problem'

export interface ProblemService {
  getProblemById(id: string): Promise<Problem>
  getProblemByIds(ids: string[]): Promise<Problem[]>
}
