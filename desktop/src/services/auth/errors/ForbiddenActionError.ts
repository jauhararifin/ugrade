import { AuthError } from './AuthError'

export class ForbiddenActionError extends AuthError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ForbiddenActionError.prototype)
  }
}
