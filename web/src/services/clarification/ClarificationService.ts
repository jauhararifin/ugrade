import { Clarification } from './Clarification'

export type ClarificationsCallback = (clarifications: Clarification[]) => any

export type ClarificationsUnsubscribe = () => any

export interface ClarificationService {
  getClarifications(token: string): Promise<Clarification[]>

  subscribeClarifications(token: string, callback: ClarificationsCallback): ClarificationsUnsubscribe

  createClarification(token: string, title: string, subject: string, content: string): Promise<Clarification>

  createClarificationEntry(token: string, clarificationId: string, content: string): Promise<Clarification>

  readClarificationEntries(token: string, clarificationId: string, entryIds: string[]): Promise<Clarification>
}
