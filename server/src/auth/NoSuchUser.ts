import { AuthError } from './AuthError'

export class NoSuchUser extends AuthError {
  constructor(m: string = 'No Such User') {
    super(m)
    Object.setPrototypeOf(this, NoSuchUser.prototype)
  }
}
