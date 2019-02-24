import { AuthError } from './AuthError'

export class UserRegistrationError extends AuthError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, UserRegistrationError.prototype)
  }
}
