export class ProfileError extends Error {
  constructor(m: string = 'Profile Error') {
    super(m)
    Object.setPrototypeOf(this, ProfileError.prototype)
  }
}
