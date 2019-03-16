import { AuthStoreError } from './AuthStoreError'

export class NoSuchCredential extends AuthStoreError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchCredential.prototype)
  }
}
