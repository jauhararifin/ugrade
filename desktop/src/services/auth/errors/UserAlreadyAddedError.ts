import { AuthError } from './AuthError'

export class UserAlreadyAddedError extends AuthError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, UserAlreadyAddedError.prototype)
  }
}
