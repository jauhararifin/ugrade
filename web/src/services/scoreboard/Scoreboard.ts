export interface ProblemScore {
  problemId: string
  attempt: number
  penalty: number
  passed: boolean
  freezed: boolean
  first: boolean
}

export interface ScoreboardEntry {
  rank: number
  contestant: string
  totalPassed: number
  totalPenalty: number
  problemScores: { [problemId: string]: ProblemScore }
}

export interface Scoreboard {
  contestId: string
  lastUpdated: Date
  freezed: boolean
  entries: ScoreboardEntry[]
}
