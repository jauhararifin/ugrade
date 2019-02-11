import { AuthenticationError } from './AuthenticationError'

export class ForbiddenActionError extends AuthenticationError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ForbiddenActionError.prototype)
  }
}
