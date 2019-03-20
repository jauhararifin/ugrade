import { Announcement } from './Announcement'

export type AnnouncementsCallback = (announcements: Announcement[]) => any

export type AnnouncementsUnsubscribe = () => any

export interface AnnouncementService {
  /**
   * Get all announcments in a contest
   * @param token User's session token
   * @returns List of announcements
   */
  getAnnouncements(token: string): Promise<Announcement[]>

  /**
   * Create new announcement in a contest
   * @param token User's session token
   * @param title Announcement title
   * @param content Announcement content
   * @return New announcement that created
   */
  createAnnouncement(token: string, title: string, content: string): Promise<Announcement>

  /**
   * Subscibe to announcements
   * @param token User's sesion token
   * @param callback Function that called when there is change in announcements
   * @returns Function to unsubscribe
   */
  subscribeAnnouncements(token: string, callback: AnnouncementsCallback): AnnouncementsUnsubscribe

  /**
   * Read announcements
   * @param token User's token
   * @param ids Announcement ids
   */
  readAnnouncements(token: string, ids: string[]): Promise<void>
}
