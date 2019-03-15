import { Grading, GradingVerdict } from './Grading'

export interface Submission {
  id: string
  issuer: string
  contestId: string
  problemId: string
  languageId: string
  issuedTime: Date
  verdict: GradingVerdict
  sourceCode: string
  gradings: Grading[]
}
