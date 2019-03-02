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
