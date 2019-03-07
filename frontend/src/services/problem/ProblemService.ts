import { Problem, ProblemType } from './Problem'

export type ProblemsCallback = (problems: Problem[]) => any

export type ProblemsUnsubscribe = () => any

export interface ProblemService {
  createProblem(
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
  ): Promise<Problem>

  getProblemById(token: string, problemId: string): Promise<Problem>

  getProblems(token: string): Promise<Problem[]>

  subscribeProblems(
    token: string,
    callback: ProblemsCallback
  ): ProblemsUnsubscribe

  deleteProblems(token: string, problemIds: string[]): Promise<string[]>
}
