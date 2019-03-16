import { UserStoreError } from './UserStoreError'

export class NoSuchUser extends UserStoreError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchUser.prototype)
  }
}
