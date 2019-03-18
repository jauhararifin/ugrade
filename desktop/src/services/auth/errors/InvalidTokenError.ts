import { AuthError } from './AuthError'

export class InvalidTokenError extends AuthError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, InvalidTokenError.prototype)
  }
}
