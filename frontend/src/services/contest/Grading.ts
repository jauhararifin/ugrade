export enum GradingVerdict {
  Pending = 'GRADING_VERDICT_PENDING',
  Accepted = 'GRADING_VERDICT_ACCEPTED',
  WrongAnswer = 'GRADING_VERDICT_WRONG_ANSWER',
  TimeLimitExceeded = 'GRADING_VERDICT_TIME_LIMIT_EXCEEDED',
  MemoryLimitExceeded = 'GRADING_VERDICT_MEMORY_LIMIT_EXCEEDED',
  RuntimeError = 'GRADING_VERDICT_RUNTIME_ERROR',
  InternalError = 'GRADING_VERDICT_INTERNAL_ERROR',
  CompilationError = 'GRADING_VERDICT_COMPILATION_ERROR',
}

export interface Grading {
  id: number
  issuedTime: Date
  verdict: GradingVerdict

  // jury may regrade the contestant solution due to technical problem. The
  // `message` field give contestant information about this.
  message: string
  compilationOutput: string
}
