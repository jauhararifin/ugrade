import { AuthError } from './AuthError'

export class InvalidCredential extends AuthError {
  constructor(m: string = 'Invalid Credential') {
    super(m)
    Object.setPrototypeOf(this, InvalidCredential.prototype)
  }
}
