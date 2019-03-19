export interface ClarificationEntry {
  id: string
  clarificationId: string
  senderId: string
  content: string
  issuedTime: Date
  read: boolean
}

export interface Clarification {
  id: string
  contestId: string
  title: string
  subject: string
  issuerId: string
  issuedTime: Date
  entryIds: string[]
}
