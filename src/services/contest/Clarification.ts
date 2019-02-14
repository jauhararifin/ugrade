export interface ClarificationEntry {
  id: number
  sender: string
  content: string
  read: boolean
  issuedTime: Date
}

export interface Clarification {
  id: number
  title: string
  subject: string
  issuedTime: Date
  entries: ClarificationEntry[]
}
