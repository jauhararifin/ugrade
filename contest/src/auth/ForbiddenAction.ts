import { AuthError } from './AuthError'

export class ForbiddenAction extends AuthError {
  constructor(m: string = 'Forbidden Action') {
    super(m)
    Object.setPrototypeOf(this, ForbiddenAction.prototype)
  }
}
