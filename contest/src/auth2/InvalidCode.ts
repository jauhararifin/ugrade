import { AuthError } from './AuthError'

export class InvalidCode extends AuthError {
  constructor(m: string = 'Invalid One Time Code') {
    super(m)
    Object.setPrototypeOf(this, InvalidCode.prototype)
  }
}
