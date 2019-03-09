import { AuthError } from './AuthError'

export class NoSuchUserError extends AuthError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchUserError.prototype)
  }
}
