export enum GradingVerdict {
  Pending = 'Pending',
  Accepted = 'Accepted',
  WrongAnswer = 'WrongAnswer',
  TimeLimitExceeded = 'TimeLimitExceeded',
  MemoryLimitExceeded = 'MemoryLimitExceeded',
  RuntimeError = 'RuntimeError',
  InternalError = 'InternalError',
  CompilationError = 'CompilationError',
}

export interface Grading {
  id: string
  submissionId: string
  issuedTime: Date
  verdict: GradingVerdict
  message: string
  compilationOutput: string
}

export interface Submission {
  id: string
  issuerId: string
  contestId: string
  problemId: string
  languageId: string
  issuedTime: Date
  verdict: GradingVerdict
  sourceCode: string
  gradings: Grading[]
}
