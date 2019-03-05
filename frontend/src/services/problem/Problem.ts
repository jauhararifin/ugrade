export enum ProblemType {
  PROBLEM_TYPE_BATCH = 0,
  PROBLEM_TYPE_INTERACTIVE = 1,
}

export interface Problem {
  id: string
  shortId: string
  name: string
  statement: string
  type: ProblemType
  disabled: boolean

  timeLimit: number
  tolerance: number
  memoryLimit: number
  outputLimit: number
}
