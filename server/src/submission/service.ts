import { Submission } from './Submission'

export interface SubmissionService {
  getContestSubmissions(token: string, contestId: string): Promise<Submission[]>
  createSubmission(token: string, problemId: string, languageId: string, sourceCode: string): Promise<Submission>
}
