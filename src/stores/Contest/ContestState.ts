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

export interface Announcement {
  id: number
  title: string
  content: string
  issuedTime: Date
  read: boolean
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
  problems?: Problem[]
  announcements?: Announcement[]
}

export interface ContestState {
  contests: Contest[]
  currentContest?: Contest
}

export const initialValue: ContestState = {
  contests: [],
}
