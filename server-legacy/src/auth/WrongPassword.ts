import { AuthError } from './AuthError'

export class WrongPassword extends AuthError {
  constructor(m: string = 'Wrong Password') {
    super(m)
    Object.setPrototypeOf(this, WrongPassword.prototype)
  }
}
