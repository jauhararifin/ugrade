import { ProfileStoreError } from './ProfileStoreError'

export class NoSuchProfile extends ProfileStoreError {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, NoSuchProfile.prototype)
  }
}
