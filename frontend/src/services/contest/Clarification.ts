export interface ClarificationEntry {
  id: string
  sender: string
  content: string
  read: boolean
  issuedTime: Date
}

export interface Clarification {
  id: string
  title: string
  subject: string
  issuedTime: Date
  entries: ClarificationEntry[]
}
