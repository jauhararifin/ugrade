export class AnnouncementError extends Error {
  constructor(m: string = 'Announcement Error') {
    super(m)
    Object.setPrototypeOf(this, AnnouncementError.prototype)
  }
}
