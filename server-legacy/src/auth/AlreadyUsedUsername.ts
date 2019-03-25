import { AuthError } from './AuthError'

export class AlreadyUsedUsername extends AuthError {
  constructor(m: string = 'Username Already Used') {
    super(m)
    Object.setPrototypeOf(this, AlreadyUsedUsername.prototype)
  }
}
