import { AnnouncementError } from './AnnouncementError'

export class AnnouncementValidationError extends AnnouncementError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, AnnouncementValidationError.prototype)
  }
}
