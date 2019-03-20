import { Problem, ProblemType } from './problem'

export interface ProblemService {
  getContestProblems(token: string, contestId: string): Promise<Problem[]>
  getContestProblemById(
    token: string,
    contestId: string,
    problemId: string
  ): Promise<Problem>
  createProblem(
    token: string,
    name: string,
    statement: string,
    type: ProblemType,
    disabled: boolean,
    timeLimit: number,
    tolerance: number,
    memoryLimit: number,
    outputLimit: number
  ): Promise<Problem>
  updateProblem(
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
  ): Promise<Problem>
  deleteProblem(token: string, problemId: string): Promise<Problem>
}
