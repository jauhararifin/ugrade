import { Submission } from './Submission'

export type SubmissionsCallback = (submissions: Submission[]) => any

export type SubmissionsUnsubscribe = () => any

export interface SubmissionService {
  getSubmissions(token: string): Promise<Submission[]>

  subscribeSubmissions(token: string, callback: SubmissionsCallback): SubmissionsUnsubscribe

  submitSolution(token: string, problemId: string, languageId: string, sourceCode: string): Promise<Submission>
}
