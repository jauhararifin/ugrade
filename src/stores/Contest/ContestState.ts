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

  currentProblem?: Problem
}

export interface ContestState {
  contests: Contest[]
  currentContest?: Contest
}

export const initialValue: ContestState = {
  contests: [],
}
