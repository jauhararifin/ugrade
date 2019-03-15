import { ClarificationEntry } from './ClarificationEntry'

export interface Clarification {
  id: string
  title: string
  subject: string
  issuedTime: Date
  entries: ClarificationEntry[]
}
