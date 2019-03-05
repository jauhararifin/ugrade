export interface Announcement {
  id: string
  title: string
  content: string
  issuedTime: Date

  /**
   * true when the user's that accessing this announcement has read. So users
   * might have different value of this field.
   */
  read: boolean
}
