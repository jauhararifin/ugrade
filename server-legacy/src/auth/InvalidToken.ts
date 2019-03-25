import { AuthError } from './AuthError'

export class InvalidToken extends AuthError {
  constructor(m: string = 'Invalid Token') {
    super(m)
    Object.setPrototypeOf(this, InvalidToken.prototype)
  }
}
