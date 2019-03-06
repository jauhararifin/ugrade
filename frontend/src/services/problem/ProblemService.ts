import { Problem } from './Problem'

export type ProblemsCallback = (problems: Problem[]) => any

export type ProblemsUnsubscribe = () => any

export interface ProblemService {
  getProblemById(token: string, problemId: string): Promise<Problem>

  getProblems(token: string): Promise<Problem[]>

  subscribeProblems(
    token: string,
    callback: ProblemsCallback
  ): ProblemsUnsubscribe

  deleteProblems(token: string, problemIds: string[]): Promise<string[]>
}
