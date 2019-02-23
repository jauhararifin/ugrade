import { Grading, GradingVerdict } from './Grading'

export type SubmissionVerdict = GradingVerdict

export interface Submission {
  id: string
  issuer: string
  contestId: string
  problemId: string
  languageId: string
  issuedTime: Date
  verdict: SubmissionVerdict
  sourceCode: string
  gradings: Grading[]
}
