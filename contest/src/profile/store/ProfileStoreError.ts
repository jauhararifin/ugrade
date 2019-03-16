export class ProfileStoreError extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, ProfileStoreError.prototype)
  }
}
