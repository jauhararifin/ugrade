export class AnnouncementError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, AnnouncementError.prototype)
  }
}
