import { Clarification, ClarificationEntry } from './clarification'

export interface ClarificationService {
  getClarificationById(
    token: string,
    clarificationId: string
  ): Promise<Clarification>
  getClarificationEntries(
    token: string,
    clarificationId: string
  ): Promise<ClarificationEntry[]>
  getContestClarifications(
    token: string,
    contestId: string
  ): Promise<Clarification[]>
  createClarification(
    token: string,
    title: string,
    subject: string,
    content: string
  ): Promise<Clarification>
  readClarificationEntry(
    token: string,
    clarificationEntryId: string
  ): Promise<Clarification>
}
