import { AnnouncementError } from './AnnouncementError'

export class NoSuchAnnouncement extends AnnouncementError {
  constructor(m: string = 'No Such Announcement') {
    super(m)
    Object.setPrototypeOf(this, NoSuchAnnouncement.prototype)
  }
}
