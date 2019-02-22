export enum ProblemType {
  PROBLEM_TYPE_BATCH = 0,
  PROBLEM_TYPE_INTERACTIVE = 1,
}

export interface Problem {
  id: number
  slug: string
  name: string
  statement: string
  type: ProblemType
  timeLimit: number
  tolerance: number
  memoryLimit: number
  outputLimit: number
}

export interface Language {
  id: number
  name: string
}

export interface Announcement {
  id: number
  title: string
  content: string
  issuedTime: Date
  read: boolean
}

export interface ClarificationEntry {
  id: number
  sender: string
  content: string
  read: boolean
  issuedTime: Date
}

export interface Clarification {
  id: number
  title: string
  subject: string
  issuedTime: Date
  entries: ClarificationEntry[]
}

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

export type SubmissionVerdict = GradingVerdict

export interface Grading {
  id: number
  issuedTime: Date
  verdict: GradingVerdict
  message: string
  compilationOutput: string
}

export interface Submission {
  id: number
  issuer: string
  contestId: number
  problemId: number
  languageId: number
  issuedTime: Date
  verdict: SubmissionVerdict

  sourceCode?: string
  gradings?: Grading[]
}

export interface Contest {
  id: number
  slug: string
  name: string
  shortDescription: string
  startTime: Date
  finishTime: Date
  freezed: boolean
  registered: boolean

  description?: string
  permittedLanguages?: Language[]

  problems?: Problem[]
  announcements?: Announcement[]
  clarifications?: Clarification[]
  submissions?: Submission[]

  currentProblem?: Problem
}

export interface ContestState {
  contests: Contest[]
  currentContest?: Contest
}

export const initialValue: ContestState = {
  contests: [],
}
