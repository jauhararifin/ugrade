import { AuthError } from './AuthError'

export class AlreadyInvitedUser extends AuthError {
  constructor(m: string = 'User Already Invited') {
    super(m)
    Object.setPrototypeOf(this, AlreadyInvitedUser.prototype)
  }
}
