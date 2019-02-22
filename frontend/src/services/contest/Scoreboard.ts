export interface ScoreboardProblemScore {
  problemId: number
  attempt: number
  penalty: number
  passed: boolean
  frozen: boolean
}

export interface ScoreboardEntry {
  rank: number
  contestant: string
  totalPassed: number
  totalPenalty: number
  problemScores: ScoreboardProblemScore[]
}

export interface Scoreboard {
  contestId: number
  lastUpdated: Date
  entries: ScoreboardEntry[]
}
