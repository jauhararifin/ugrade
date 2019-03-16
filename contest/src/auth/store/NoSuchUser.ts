import { AuthStoreError } from './AuthStoreError'

export class NoSuchUser extends AuthStoreError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchUser.prototype)
  }
}
