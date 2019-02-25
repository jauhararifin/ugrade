import { Problem } from './Problem'

export interface ProblemService {
  getProblemById(token: string, id: string): Promise<Problem>
  getProblemByIds(token: string, ids: string[]): Promise<Problem[]>
}
