export interface ScoreboardProblemScore {
  problemId: string
  attempt: number
  penalty: number
  passed: boolean
  frozen: boolean
  first: boolean
}

export interface ScoreboardEntry {
  rank: number
  contestant: string
  totalPassed: number
  totalPenalty: number
  problemScores: { [problemId: string]: ScoreboardProblemScore }
}

export interface Scoreboard {
  contestId: string
  lastUpdated: Date
  entries: ScoreboardEntry[]
}

export enum ProblemType {
  PROBLEM_TYPE_BATCH = 0,
  PROBLEM_TYPE_INTERACTIVE = 1,
}

export interface Problem {
  id: string
  shortId: string
  name: string
  statement: string
  order: number
  type: ProblemType
  timeLimit: number
  tolerance: number
  memoryLimit: number
  outputLimit: number
}

export interface Language {
  id: string
  name: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  issuedTime: Date
  read: boolean
}

export interface ClarificationEntry {
  id: string
  sender: string
  content: string
  read: boolean
  issuedTime: Date
}

export interface Clarification {
  id: string
  title: string
  subject: string
  issuedTime: Date
  entries: { [clarificationEntryId: string]: ClarificationEntry }
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
  id: string
  issuedTime: Date
  verdict: GradingVerdict
  message: string
  compilationOutput: string
}

export interface Submission {
  id: string
  contestId: string
  problemId: string
  languageId: string
  issuedTime: Date
  verdict: SubmissionVerdict
  sourceCode?: string
  gradings?: Grading[]
}

export interface ContestInfo {
  id: string
  shortId: string
  name: string
  shortDescription: string
  startTime: Date
  finishTime: Date
  freezed: boolean
  description: string
  permittedLanguages: Language[]
}

export interface ContestState {
  info?: ContestInfo
  registered?: boolean
  problems?: { [problemId: string]: Problem }
  announcements?: { [announcementId: string]: Announcement }
  clarifications?: { [clarificationId: string]: Clarification }
  submissions?: { [submissionId: string]: Submission }
  scoreboard?: Scoreboard
}

export const initialValue: ContestState = {}
