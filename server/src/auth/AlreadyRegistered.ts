import { AuthError } from './AuthError'

export class AlreadyRegistered extends AuthError {
  constructor(m: string = 'User Already Registered') {
    super(m)
    Object.setPrototypeOf(this, AlreadyRegistered.prototype)
  }
}
