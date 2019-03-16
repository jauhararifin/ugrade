import { AuthError } from './AuthError'

export class InvalidCredential extends AuthError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, InvalidCredential.prototype)
  }
}
