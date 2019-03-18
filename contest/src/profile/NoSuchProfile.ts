import { ProfileError } from './ProfileError'

export class NoSuchProfile extends ProfileError {
  constructor(m: string = 'No Such Profile') {
    super(m)
    Object.setPrototypeOf(this, NoSuchProfile.prototype)
  }
}
