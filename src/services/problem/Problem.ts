export enum ProblemType {
  PROBLEM_TYPE_BATCH = 0,
  PROBLEM_TYPE_INTERACTIVE = 1,
}

export interface Problem {
  id: number
  slug: string
  name: string
  description: string
  type: ProblemType
}
