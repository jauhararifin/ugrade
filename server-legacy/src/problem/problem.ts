export enum ProblemType {
  Batch = 'Batch',
  Interactive = 'Interactive',
}

export interface Problem {
  id: string
  contestId: string
  issuerId: string
  shortId: string
  name: string
  statement: string
  type: ProblemType
  disabled: boolean
  issuedTime: Date
  order: number
  timeLimit: number
  tolerance: number
  memoryLimit: number
  outputLimit: number
}
