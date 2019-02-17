import { Grading, GradingVerdict } from './Grading'

export type SubmissionVerdict = GradingVerdict

export interface Submission {
  id: number
  issuer: string
  contestId: number
  problemId: number
  languageId: number
  issuedTime: Date
  verdict: SubmissionVerdict
}

export interface SubmissionDetail extends Submission {
  sourceCode: string
  gradings: Grading[]
}
